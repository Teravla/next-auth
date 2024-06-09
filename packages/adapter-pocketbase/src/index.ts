import PocketBase, { RecordModel } from 'pocketbase';
import type { Adapter, AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from "@auth/core/adapters";

// Créez une instance de PocketBase avec l'URL de votre serveur PocketBase
const pb = new PocketBase('http://127.0.0.1:8090');

// Implémenter l'adaptateur en utilisant le type générique
export function pocketbaseAdapter(): Adapter {
    return {
        async createUser(user: AdapterUser): Promise<AdapterUser> {
            // Préparez les données pour la création de l'utilisateur
            const data = {
                "username": user.name || '',  // Vous pouvez générer un nom d'utilisateur si nécessaire
                "email": user.email,
                "password": "defaultPassword123!",  // Vous devez gérer la génération et le stockage du mot de passe de manière sécurisée
                "passwordConfirm": "defaultPassword123!",
                "name": user.name || '',  // Utilisez le nom fourni ou une chaîne vide si non disponible
                "avatar": user.image || ''  // Utilisez l'avatar fourni ou une chaîne vide si non disponible
            };
        
            // Créez l'utilisateur dans PocketBase
            try {
                const record = await pb.collection('users').create(data);
                // Retournez l'utilisateur créé
                return {
                    id: record.id,
                    email: record.email,
                    emailVerified: record.verified || null,
                    image: record.avatar || null,
                    name: record.username || null
                } as AdapterUser ?? null;
            } catch (error) {
                console.error("Error creating user:", error);
                throw new Error('Failed to create user');
            }
        },
        

        async getUser(id: string): Promise<AdapterUser | null> {
            try {
                // Récupérer un utilisateur à partir de son ID dans la base de données
                const record = await pb.collection('users').getOne(id);
        
                // Retournez l'utilisateur récupéré
                const user: AdapterUser = {
                    id: record.id,
                    email: record.email,
                    emailVerified: record.verified || null,
                    image: record.avatar || null, 
                    name: record.username || null,
                };
                return user;
            } catch (error) {
                console.error("Error fetching user:", error);
                return null;  // Retournez null si l'utilisateur n'est pas trouvé ou en cas d'erreur
            }
        },
        
        

        async getUserByAccount(providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">): Promise<AdapterUser | null> {
            try {
                // Utiliser l'ID du fournisseur pour récupérer l'utilisateur dans la base de données
                const record = await pb.collection('users').getList(1, 1, {
                    filter: `providerAccountId='${providerAccountId.providerAccountId}'`
                });
                
                // Vérifier si un enregistrement a été trouvé
                if (record.totalItems === 1) {
                    // Retourner le premier utilisateur trouvé
                    const userRecord = record.items[0];
                    return {
                        id: userRecord.id,
                        email: userRecord.email,
                        emailVerified: userRecord.verified || null,
                        image: userRecord.avatar || null,
                        name: userRecord.username || null,
                    } as AdapterUser;
                } else {
                    return null;
                }
            } catch (error) {
                console.error("Error fetching user by account:", error);
                return null;  // Retournez null en cas d'erreur
            }
        },
        

        async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">): Promise<AdapterUser> {
            // Préparer les données pour la mise à jour de l'utilisateur
            const data: Record<string, any> = {
                "name": user.name || '',  // Nom, facultatif
                "avatar": user.image !== undefined ? user.image : ''  // Avatar, facultatif
            };
        
            // Vérifier si les propriétés de mot de passe sont présentes dans l'objet user
            if ('oldPassword' in user && 'password' in user && 'passwordConfirm' in user) {
                // Propriétés de mot de passe fournies, les inclure dans les données de mise à jour
                data['oldPassword'] = user.oldPassword || '';  // Ancien mot de passe, facultatif
                data['password'] = user.password || '';  // Nouveau mot de passe, facultatif
                data['passwordConfirm'] = user.passwordConfirm || '';  // Confirmation du nouveau mot de passe, facultatif
            }
        
            // Créer la requête de mise à jour dans PocketBase
            try {
                const record = await pb.collection('users').update(user.id, data);
        
                // Retourner l'utilisateur mis à jour
                return {
                    id: record.id,
                    email: record.email,
                    emailVerified: record.verified || null,
                    image: record.avatar || null, 
                    name: record.username || null
                };
            } catch (error) {
                console.error("Error updating user:", error);
                throw new Error('Failed to update user');
            }
        },
        

        async linkAccount(account: AdapterAccount): Promise<void> {
            // Préparer les données pour lier le compte à l'utilisateur
            const data = {
                "userId": account.userId,  // ID de l'utilisateur auquel le compte sera lié
                "type": account.type,  // Type du compte (OAuth, Email, etc.)
                "provider": account.provider,  // Fournisseur du compte (Google, Facebook, etc.)
                "providerAccountId": account.providerAccountId,  // ID du compte fourni par le fournisseur
                // Autres propriétés du compte si nécessaire (access_token, refresh_token, etc.)
            };
        
            // Créer le compte dans PocketBase
            try {
                await pb.collection('accounts').create(data);
            } catch (error) {
                console.error("Error linking account:", error);
                throw new Error('Failed to link account');
            }
        },

        async createSession(session: { userId: string, sessionToken: string, expires: Date }): Promise<AdapterSession> {
            try {
                // Créer une session dans la base de données
                const record = await pb.collection('session').create(session);
        
                // Retourner la session créée
                return {
                    userId: record.userId,
                    sessionToken: record.sessionToken,
                    expires: new Date(record.expires)
                };
            } catch (error) {
                console.error("Error creating session:", error);
                throw new Error('Failed to create session');
            }
        }, 

        async getSessionAndUser(sessionToken: string): Promise<null | { session: AdapterSession; user: AdapterUser; }> {
            try {
                // Récupérer la session avec le jeton donné
                const session: RecordModel = await pb.collection('sessions').getOne(sessionToken);
                
                // Si aucune session n'est trouvée avec le jeton donné, retourner null
                if (!session) {
                    console.error("Aucune session trouvée avec le jeton donné:", sessionToken);
                    return null;
                }
                
                // Récupérer l'utilisateur associé à cette session
                const user: RecordModel = await pb.collection('users').getOne(session.userId);
                
                // Si aucun utilisateur n'est trouvé avec l'ID de l'utilisateur dans la session, retourner null
                if (!user) {
                    console.error("Aucun utilisateur trouvé avec l'ID de session:", session.userId);
                    return null;
                }
                
                // Mapper les propriétés des types retournés vers les types AdapterSession et AdapterUser
                const adaptedSession: AdapterSession = {
                    sessionToken: session.sessionToken,
                    userId: session.userId,
                    expires: session.expires
                };
        
                const adaptedUser: AdapterUser = {
                    id: user.id,
                    email: user.email,
                    emailVerified: user.emailVerified || null,
                    image: user.image || null,
                    name: user.name || null,
                };
                
                // Retourner la session et l'utilisateur
                return { session: adaptedSession, user: adaptedUser };
            } catch (error) {
                console.error("Erreur lors de la récupération de la session et de l'utilisateur:", error);
                return null;
            }
        }, 

        async updateSession(session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">): Promise<undefined | null | AdapterSession> {
            try {
                // Extrayez le jeton de session de l'objet session
                const { sessionToken, ...sessionData } = session;
        
                // Mettre à jour la session dans la base de données
                const updatedSession: RecordModel = await pb.collection('sessions').update(sessionToken, sessionData);
        
                // Si la session mise à jour n'existe pas, retournez null
                if (!updatedSession) {
                    console.error("La session n'a pas pu être mise à jour. La session avec le jeton suivant n'existe pas :", sessionToken);
                    return null;
                }
        
                // Retourner la session mise à jour
                return {
                    sessionToken: updatedSession.sessionToken,
                    userId: updatedSession.userId,
                    expires: updatedSession.expires
                };
            } catch (error) {
                console.error("Erreur lors de la mise à jour de la session :", error);
                return undefined;
            }
        }, 

        async deleteSession(sessionToken: string): Promise<void> {
            try {
                // Supprimer la session de la base de données
                await pb.collection('session').delete(sessionToken);
            } catch (error) {
                console.error("Erreur lors de la suppression de la session:", error);
            }
            // Retourner void même si une session a été supprimée avec succès
            return;
        }, 

        async getUserByEmail(email: string): Promise<null | AdapterUser> {
            try {
                // Récupérer l'utilisateur à partir de son adresse e-mail dans la base de données
                const record = await pb.collection('users').getList(1, 1, {
                    filter: `email='${email}'`
                });
                
                // Vérifier si un enregistrement a été trouvé
                if (record.totalItems === 1) {
                    // Retourner l'utilisateur trouvé
                    const userRecord = record.items[0];
                    const user: AdapterUser = {
                        id: userRecord.id,
                        email: userRecord.email,
                        emailVerified: userRecord.verified || null,
                        image: userRecord.avatar || null,
                        name: userRecord.username || null,
                    };
                    return user;
                } else {
                    // Aucun utilisateur trouvé
                    return null;
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur par e-mail:", error);
                return null;
            }
        }, 


        async createVerificationToken(verificationToken: VerificationToken): Promise<undefined | null | VerificationToken> {
            try {
                // Créer un nouveau jeton de vérification dans la base de données
                const createdRecord: RecordModel = await pb.collection('token').create(verificationToken);
        
                // Si le jeton de vérification créé est null, retourner null
                if (!createdRecord) {
                    console.error("Le jeton de vérification n'a pas pu être créé.");
                    return null;
                }
        
                // Retourner le jeton de vérification créé
                return {
                    identifier: createdRecord.identifier,
                    expires: createdRecord.expires,
                    token: createdRecord.token
                };
            } catch (error) {
                console.error("Erreur lors de la création du jeton de vérification :", error);
                return undefined;
            }
        }, 

        async useVerificationToken(params: { identifier: string; token: string }): Promise<null | VerificationToken> {
            try {
                const { identifier, token } = params;
        
                // Récupérer le jeton de vérification de la base de données
                const record = await pb.collection('token').getList(1, 1, {
                    filter: `identifier='${identifier}' AND token='${token}'`
                });
        
                // Vérifier si un enregistrement a été trouvé
                if (!record || record.totalItems !== 1) {
                    console.error("Aucun jeton de vérification trouvé pour les paramètres donnés.");
                    return null;
                }
        
                // Supprimer le jeton de vérification de la base de données
                await pb.collection('token').delete(record.items[0].id);
        
                // Retourner le jeton de vérification récupéré
                return {
                    identifier: record.items[0].identifier,
                    expires: record.items[0].expires,
                    token: record.items[0].token
                };
            } catch (error) {
                console.error("Erreur lors de l'utilisation du jeton de vérification :", error);
                return null;
            }
        }
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    };
}
