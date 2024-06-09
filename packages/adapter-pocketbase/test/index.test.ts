import { config } from 'dotenv'; // Importer la bibliothèque dotenv
import { pocketbaseAdapter } from '../src/index';
import { runBasicTests } from '../../utils/adapter';
import PocketBase from 'pocketbase';

// Charger les variables d'environnement à partir du fichier .env
config();

const pb = new PocketBase('http://127.0.0.1:8090');
const adapter = pocketbaseAdapter();

// Fonction pour supprimer toutes les données d'une table
async function DeleteAllData(tableName: string) {
    try {

        // Récupérer tous les enregistrements de la table
        const records = await pb.collection(tableName).getList();

        // Supprimer chaque enregistrement individuellement
        await Promise.all(records.items.map(async (record) => {
            await pb.collection(tableName).delete(record.id);
        }));

        console.log(`Toutes les données ont été supprimées de la table '${tableName}'.`);
    } catch (error) {
        console.error(`Erreur lors de la suppression des données de la table '${tableName}':`, error);
    }
}

async function CreateCollections() {
    try {
        // Créer la collection "users"
        await pb.collections.create({
            name: 'users',
            type: 'base',
            schema: [
                { name: 'Id', type: 'text', required: true },
                { name: 'username', type: 'text', required: true },
                { name: 'name', type: 'text', required: false },
                { name: 'email', type: 'text', required: true },
                { name: 'avatar', type: 'text', required: false },
                { name: 'created', type: 'text', required: true },
                { name: 'updated', type: 'text', required: true }
            ]
        });

        // Créer la collection "accounts"
        await pb.collections.create({
            name: 'accounts',
            type: 'base',
            schema: [
                { name: 'Id', type: 'text', required: true },
                { name: 'userId', type: 'text', required: true },
                { name: 'provider', type: 'text', required: true },
                { name: 'providerAccountId', type: 'text', required: true },
                { name: 'refresh_token', type: 'text', required: true },
                { name: 'access_token', type: 'text', required: true },
                { name: 'expires_at', type: 'text', required: true },
                { name: 'created', type: 'text', required: true },
                { name: 'updated', type: 'text', required: true },
                { name: 'type', type: 'text', required: true }
            ]
        });

        // Créer la collection "session"
        await pb.collections.create({
            name: 'session',
            type: 'base',
            schema: [
                { name: 'Id', type: 'text', required: true },
                { name: 'userId', type: 'text', required: true },
                { name: 'expires', type: 'text', required: true },
                { name: 'sessionToken', type: 'text', required: true },
                { name: 'created', type: 'text', required: true },
                { name: 'updated', type: 'text', required: true }
            ]
        });

        // Créer la collection "token"
        await pb.collections.create({
            name: 'token',
            type: 'base',
            schema: [
                { name: 'Id', type: 'text', required: true },
                { name: 'identifier', type: 'text', required: true },
                { name: 'token', type: 'text', required: true },
                { name: 'expires', type: 'text', required: true },
                { name: 'created', type: 'text', required: true },
                { name: 'updated', type: 'text', required: true }
            ]
        });

        console.log("Collections created successfully.");
    } catch (error) {
        console.error("Error creating collections:", error);
    }
}



runBasicTests({
    adapter: pocketbaseAdapter(),
    testWebAuthnMethods: false,
    db: {
        id() {
            return Math.random().toString(15).substring(7);
        },
        connect: async () => {
            await Promise.all([
                CreateCollections(),
                DeleteAllData('users'),
                DeleteAllData('accounts'),
            ]);
        },
        disconnect: async () => {
            await Promise.all([
                DeleteAllData('users'),
                DeleteAllData('accounts'),
            ]);
        },
        user: async (id) => {
            if (adapter && adapter.getUser) { // Vérifiez que adapter et adapter.getUser sont définis
                const user = await adapter.getUser(id);
                // Utilisez user ici
            } else {
                console.error("pocketbaseAdapter or adapter.getUser is not defined.");
            }
        },
        
        account: async (provider_providerAccountId) => {
            // Code pour récupérer un compte
            try {
                // Extraire l'ID du compte de l'objet provider_providerAccountId
                const accountId = provider_providerAccountId.providerAccountId;
        
                // Utiliser l'ID du compte pour récupérer le record
                const record = await pb.collection('accounts').getOne(accountId);
        
                // Retourner le record récupéré
                return record;
            } catch (error) {
                console.error("Error fetching account:", error);
                return null;
            }
        },
        
        session: async (sessionToken) => {
            // Code pour récupérer une session
            try {
                // Utiliser le jeton de session pour récupérer le record
                const record = await pb.collection('session').getOne(sessionToken);

                // Retourner le record récupéré
                return record;
            } catch (error) {
                console.error("Error fetching session:", error);
                return null;
            }
        },
        verificationToken: async (params: { identifier: string; token: string }) => {
            // Extraire les valeurs de l'objet params
            const { identifier, token } = params;
        
            // Code pour récupérer un jeton de vérification
            try {
                // Utiliser l'identifiant du jeton pour récupérer le record
                const record = await pb.collection('verificationTokens').getOne(identifier);
        
                // Vérifier si le record correspond au token donné
                if (record && record.token === token) {
                    // Retourner le record récupéré
                    return record;
                } else {
                    console.error("Verification token not found or token mismatch.");
                    return null;
                }
            } catch (error) {
                console.error("Error fetching verification token:", error);
                return null;
            }
        },
        
        authenticator: async (credentialID) => {
            // Code pour récupérer un authenticator
            try {
                // Utiliser l'ID d'authentification pour récupérer l'authentificateur dans la base de données
                return null;
            } catch (error) {
                console.error("Error fetching authenticator:", error);
                return null;
            }
        },
    },
});
