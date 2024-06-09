"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperimentalFeatureNotEnabled = exports.AccountNotLinked = exports.WebAuthnVerificationError = exports.MissingWebAuthnAutocomplete = exports.DuplicateConditionalUI = exports.isClientError = exports.MissingCSRF = exports.Verification = exports.UntrustedHost = exports.InvalidProvider = exports.UnsupportedStrategy = exports.UnknownAction = exports.SignOutError = exports.EmailSignInError = exports.OAuthSignInError = exports.SessionTokenError = exports.OAuthProfileParseError = exports.OAuthCallbackError = exports.OAuthAccountNotLinked = exports.MissingSecret = exports.MissingAuthorize = exports.MissingAdapterMethods = exports.MissingAdapter = exports.JWTSessionError = exports.InvalidCheck = exports.InvalidEndpoints = exports.CredentialsSignin = exports.InvalidCallbackUrl = exports.EventError = exports.ErrorPageLoop = exports.CallbackRouteError = exports.AccessDenied = exports.AdapterError = exports.SignInError = exports.AuthError = void 0;
/**
 * Base error class for all Auth.js errors.
 * It's optimized to be printed in the server logs in a nicely formatted way
 * via the [`logger.error`](https://authjs.dev/reference/core#logger) option.
 */
var AuthError = /** @class */ (function (_super) {
    __extends(AuthError, _super);
    function AuthError(message, errorOptions) {
        var _this = this;
        var _a, _b, _c;
        if (message instanceof Error) {
            _this = _super.call(this, undefined, {
                cause: __assign(__assign({ err: message }, message.cause), errorOptions),
            }) || this;
        }
        else if (typeof message === "string") {
            if (errorOptions instanceof Error) {
                errorOptions = __assign({ err: errorOptions }, errorOptions.cause);
            }
            _this = _super.call(this, message, errorOptions) || this;
        }
        else {
            _this = _super.call(this, undefined, message) || this;
        }
        _this.name = _this.constructor.name;
        // @ts-expect-error https://github.com/microsoft/TypeScript/issues/3841
        _this.type = (_a = _this.constructor.type) !== null && _a !== void 0 ? _a : "AuthError";
        // @ts-expect-error https://github.com/microsoft/TypeScript/issues/3841
        _this.kind = (_b = _this.constructor.kind) !== null && _b !== void 0 ? _b : "error";
        (_c = Error.captureStackTrace) === null || _c === void 0 ? void 0 : _c.call(Error, _this, _this.constructor);
        var url = "https://errors.authjs.dev#".concat(_this.type.toLowerCase());
        _this.message += "".concat(_this.message ? ". " : "", "Read more at ").concat(url);
        return _this;
    }
    return AuthError;
}(Error));
exports.AuthError = AuthError;
var SignInError = /** @class */ (function (_super) {
    __extends(SignInError, _super);
    function SignInError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SignInError.kind = "signIn";
    return SignInError;
}(AuthError));
exports.SignInError = SignInError;
/**
 * One of the database [`Adapter` methods](https://authjs.dev/reference/core/adapters#methods)
 * failed during execution.
 *
 * :::tip
 * If `debug: true` is set, you can check out `[auth][debug]` in the logs to learn more about the failed adapter method execution.
 * @example
 * ```sh
 * [auth][debug]: adapter_getUserByEmail
 * { "args": [undefined] }
 * ```
 * :::
 */
var AdapterError = /** @class */ (function (_super) {
    __extends(AdapterError, _super);
    function AdapterError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AdapterError.type = "AdapterError";
    return AdapterError;
}(AuthError));
exports.AdapterError = AdapterError;
/**
 * Thrown when the execution of the [`signIn` callback](https://authjs.dev/reference/core/types#signin) fails
 * or if it returns `false`.
 */
var AccessDenied = /** @class */ (function (_super) {
    __extends(AccessDenied, _super);
    function AccessDenied() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AccessDenied.type = "AccessDenied";
    return AccessDenied;
}(AuthError));
exports.AccessDenied = AccessDenied;
/**
 * This error occurs when the user cannot finish login.
 * Depending on the provider type, this could have happened for multiple reasons.
 *
 * :::tip
 * Check out `[auth][details]` in the logs to know which provider failed.
 * @example
 * ```sh
 * [auth][details]: { "provider": "github" }
 * ```
 * :::
 *
 * For an [OAuth provider](https://authjs.dev/getting-started/authentication/oauth), possible causes are:
 * - The user denied access to the application
 * - There was an error parsing the OAuth Profile:
 *   Check out the provider's `profile` or `userinfo.request` method to make sure
 *   it correctly fetches the user's profile.
 * - The `signIn` or `jwt` callback methods threw an uncaught error:
 *   Check the callback method implementations.
 *
 * For an [Email provider](https://authjs.dev/getting-started/authentication/email), possible causes are:
 * - The provided email/token combination was invalid/missing:
 *   Check if the provider's `sendVerificationRequest` method correctly sends the email.
 * - The provided email/token combination has expired:
 *   Ask the user to log in again.
 * - There was an error with the database:
 *   Check the database logs.
 *
 * For a [Credentials provider](https://authjs.dev/getting-started/authentication/credentials), possible causes are:
 * - The `authorize` method threw an uncaught error:
 *   Check the provider's `authorize` method.
 * - The `signIn` or `jwt` callback methods threw an uncaught error:
 *   Check the callback method implementations.
 *
 * :::tip
 * Check out `[auth][cause]` in the error message for more details.
 * It will show the original stack trace.
 * :::
 */
var CallbackRouteError = /** @class */ (function (_super) {
    __extends(CallbackRouteError, _super);
    function CallbackRouteError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CallbackRouteError.type = "CallbackRouteError";
    return CallbackRouteError;
}(AuthError));
exports.CallbackRouteError = CallbackRouteError;
/**
 * Thrown when Auth.js is misconfigured and accidentally tried to require authentication on a custom error page.
 * To prevent an infinite loop, Auth.js will instead render its default error page.
 *
 * To fix this, make sure that the `error` page does not require authentication.
 *
 * Learn more at [Guide: Error pages](https://authjs.dev/guides/pages/error)
 */
var ErrorPageLoop = /** @class */ (function (_super) {
    __extends(ErrorPageLoop, _super);
    function ErrorPageLoop() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ErrorPageLoop.type = "ErrorPageLoop";
    return ErrorPageLoop;
}(AuthError));
exports.ErrorPageLoop = ErrorPageLoop;
/**
 * One of the [`events` methods](https://authjs.dev/reference/core/types#eventcallbacks)
 * failed during execution.
 *
 * Make sure that the `events` methods are implemented correctly and uncaught errors are handled.
 *
 * Learn more at [`events`](https://authjs.dev/reference/core/types#eventcallbacks)
 */
var EventError = /** @class */ (function (_super) {
    __extends(EventError, _super);
    function EventError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EventError.type = "EventError";
    return EventError;
}(AuthError));
exports.EventError = EventError;
/**
 * Thrown when Auth.js is unable to verify a `callbackUrl` value.
 * The browser either disabled cookies or the `callbackUrl` is not a valid URL.
 *
 * Somebody might have tried to manipulate the callback URL that Auth.js uses to redirect the user back to the configured `callbackUrl`/page.
 * This could be a malicious hacker trying to redirect the user to a phishing site.
 * To prevent this, Auth.js checks if the callback URL is valid and throws this error if it is not.
 *
 * There is no action required, but it might be an indicator that somebody is trying to attack your application.
 */
var InvalidCallbackUrl = /** @class */ (function (_super) {
    __extends(InvalidCallbackUrl, _super);
    function InvalidCallbackUrl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InvalidCallbackUrl.type = "InvalidCallbackUrl";
    return InvalidCallbackUrl;
}(AuthError));
exports.InvalidCallbackUrl = InvalidCallbackUrl;
/**
 * Can be thrown from the `authorize` callback of the Credentials provider.
 * When an error occurs during the `authorize` callback, two things can happen:
 * 1. The user is redirected to the signin page, with `error=CredentialsSignin&code=credentials` in the URL. `code` is configurable.
 * 2. If you throw this error in a framework that handles form actions server-side, this error is thrown, instead of redirecting the user, so you'll need to handle.
 */
var CredentialsSignin = /** @class */ (function (_super) {
    __extends(CredentialsSignin, _super);
    function CredentialsSignin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * The error code that is set in the `code` query parameter of the redirect URL.
         *
         *
         * ⚠ NOTE: This property is going to be included in the URL, so make sure it does not hint at sensitive errors.
         *
         * The full error is always logged on the server, if you need to debug.
         *
         * Generally, we don't recommend hinting specifically if the user had either a wrong username or password specifically,
         * try rather something like "Invalid credentials".
         */
        _this.code = "credentials";
        return _this;
    }
    CredentialsSignin.type = "CredentialsSignin";
    return CredentialsSignin;
}(Error));
exports.CredentialsSignin = CredentialsSignin;
/**
 * One of the configured OAuth or OIDC providers is missing the `authorization`, `token` or `userinfo`, or `issuer` configuration.
 * To perform OAuth or OIDC sign in, at least one of these endpoints is required.
 *
 * Learn more at [`OAuth2Config`](https://authjs.dev/reference/core/providers#oauth2configprofile) or [Guide: OAuth Provider](https://authjs.dev/guides/configuring-oauth-providers)
 */
var InvalidEndpoints = /** @class */ (function (_super) {
    __extends(InvalidEndpoints, _super);
    function InvalidEndpoints() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InvalidEndpoints.type = "InvalidEndpoints";
    return InvalidEndpoints;
}(AuthError));
exports.InvalidEndpoints = InvalidEndpoints;
/**
 * Thrown when a PKCE, state or nonce OAuth check could not be performed.
 * This could happen if the OAuth provider is configured incorrectly or if the browser is blocking cookies.
 *
 * Learn more at [`checks`](https://authjs.dev/reference/core/providers#checks)
 */
var InvalidCheck = /** @class */ (function (_super) {
    __extends(InvalidCheck, _super);
    function InvalidCheck() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InvalidCheck.type = "InvalidCheck";
    return InvalidCheck;
}(AuthError));
exports.InvalidCheck = InvalidCheck;
/**
 * Logged on the server when Auth.js could not decode or encode a JWT-based (`strategy: "jwt"`) session.
 *
 * Possible causes are either a misconfigured `secret` or a malformed JWT or `encode/decode` methods.
 *
 * :::note
 * When this error is logged, the session cookie is destroyed.
 * :::
 *
 * Learn more at [`secret`](https://authjs.dev/reference/core#secret), [`jwt.encode`](https://authjs.dev/reference/core/jwt#encode-1) or [`jwt.decode`](https://authjs.dev/reference/core/jwt#decode-2) for more information.
 */
var JWTSessionError = /** @class */ (function (_super) {
    __extends(JWTSessionError, _super);
    function JWTSessionError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JWTSessionError.type = "JWTSessionError";
    return JWTSessionError;
}(AuthError));
exports.JWTSessionError = JWTSessionError;
/**
 * Thrown if Auth.js is misonfigured. This could happen if you configured an Email provider but did not set up a database adapter,
 * or tried using a `strategy: "database"` session without a database adapter.
 * In both cases, make sure you either remove the configuration or add the missing adapter.
 *
 * Learn more at [Database Adapters](https://authjs.dev/getting-started/database), [Email provider](https://authjs.dev/getting-started/authentication/email) or [Concept: Database session strategy](https://authjs.dev/concepts/session-strategies#database-session)
 */
var MissingAdapter = /** @class */ (function (_super) {
    __extends(MissingAdapter, _super);
    function MissingAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MissingAdapter.type = "MissingAdapter";
    return MissingAdapter;
}(AuthError));
exports.MissingAdapter = MissingAdapter;
/**
 * Thrown similarily to [`MissingAdapter`](https://authjs.dev/reference/core/errors#missingadapter), but only some required methods were missing.
 *
 * Make sure you either remove the configuration or add the missing methods to the adapter.
 *
 * Learn more at [Database Adapters](https://authjs.dev/getting-started/database)
 */
var MissingAdapterMethods = /** @class */ (function (_super) {
    __extends(MissingAdapterMethods, _super);
    function MissingAdapterMethods() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MissingAdapterMethods.type = "MissingAdapterMethods";
    return MissingAdapterMethods;
}(AuthError));
exports.MissingAdapterMethods = MissingAdapterMethods;
/**
 * Thrown when a Credentials provider is missing the `authorize` configuration.
 * To perform credentials sign in, the `authorize` method is required.
 *
 * Learn more at [Credentials provider](https://authjs.dev/getting-started/authentication/credentials)
 */
var MissingAuthorize = /** @class */ (function (_super) {
    __extends(MissingAuthorize, _super);
    function MissingAuthorize() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MissingAuthorize.type = "MissingAuthorize";
    return MissingAuthorize;
}(AuthError));
exports.MissingAuthorize = MissingAuthorize;
/**
 * Auth.js requires a secret or multiple secrets to be set, but none was not found. This is used to encrypt cookies, JWTs and other sensitive data.
 *
 * :::note
 * If you are using a framework like Next.js, we try to automatically infer the secret from the `AUTH_SECRET`, `AUTH_SECRET_1`, etc. environment variables.
 * Alternatively, you can also explicitly set the [`AuthConfig.secret`](https://authjs.dev/reference/core#secret) option.
 * :::
 *
 *
 * :::tip
 * To generate a random string, you can use the Auth.js CLI: `npx auth secret`
 * :::
 */
var MissingSecret = /** @class */ (function (_super) {
    __extends(MissingSecret, _super);
    function MissingSecret() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MissingSecret.type = "MissingSecret";
    return MissingSecret;
}(AuthError));
exports.MissingSecret = MissingSecret;
/**
 * Thrown when an Email address is already associated with an account
 * but the user is trying an OAuth account that is not linked to it.
 *
 * For security reasons, Auth.js does not automatically link OAuth accounts to existing accounts if the user is not signed in.
 *
 * :::tip
 * If you trust the OAuth provider to have verified the user's email address,
 * you can enable automatic account linking by setting [`allowDangerousEmailAccountLinking: true`](https://authjs.dev/reference/core/providers#allowdangerousemailaccountlinking)
 * in the provider configuration.
 * :::
 */
var OAuthAccountNotLinked = /** @class */ (function (_super) {
    __extends(OAuthAccountNotLinked, _super);
    function OAuthAccountNotLinked() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OAuthAccountNotLinked.type = "OAuthAccountNotLinked";
    return OAuthAccountNotLinked;
}(SignInError));
exports.OAuthAccountNotLinked = OAuthAccountNotLinked;
/**
 * Thrown when an OAuth provider returns an error during the sign in process.
 * This could happen for example if the user denied access to the application or there was a configuration error.
 *
 * For a full list of possible reasons, check out the specification [Authorization Code Grant: Error Response](https://www.rfc-editor.org/rfc/rfc6749#section-4.1.2.1)
 */
var OAuthCallbackError = /** @class */ (function (_super) {
    __extends(OAuthCallbackError, _super);
    function OAuthCallbackError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OAuthCallbackError.type = "OAuthCallbackError";
    return OAuthCallbackError;
}(SignInError));
exports.OAuthCallbackError = OAuthCallbackError;
/**
 * This error occurs during an OAuth sign in attempt when the provider's
 * response could not be parsed. This could for example happen if the provider's API
 * changed, or the [`OAuth2Config.profile`](https://authjs.dev/reference/core/providers#oauth2configprofile) method is not implemented correctly.
 */
var OAuthProfileParseError = /** @class */ (function (_super) {
    __extends(OAuthProfileParseError, _super);
    function OAuthProfileParseError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OAuthProfileParseError.type = "OAuthProfileParseError";
    return OAuthProfileParseError;
}(AuthError));
exports.OAuthProfileParseError = OAuthProfileParseError;
/**
 * Logged on the server when Auth.js could not retrieve a session from the database (`strategy: "database"`).
 *
 * The database adapter might be misconfigured or the database is not reachable.
 *
 * Learn more at [Concept: Database session strategy](https://authjs.dev/concepts/session-strategies#database)
 */
var SessionTokenError = /** @class */ (function (_super) {
    __extends(SessionTokenError, _super);
    function SessionTokenError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SessionTokenError.type = "SessionTokenError";
    return SessionTokenError;
}(AuthError));
exports.SessionTokenError = SessionTokenError;
/**
 * Happens when login by [OAuth](https://authjs.dev/getting-started/authentication/oauth) could not be started.
 *
 * Possible causes are:
 * - The Authorization Server is not compliant with the [OAuth 2.0](https://www.ietf.org/rfc/rfc6749.html) or the [OIDC](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *   Check the details in the error message.
 *
 * :::tip
 * Check out `[auth][details]` in the logs to know which provider failed.
 * @example
 * ```sh
 * [auth][details]: { "provider": "github" }
 * ```
 * :::
 */
var OAuthSignInError = /** @class */ (function (_super) {
    __extends(OAuthSignInError, _super);
    function OAuthSignInError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OAuthSignInError.type = "OAuthSignInError";
    return OAuthSignInError;
}(SignInError));
exports.OAuthSignInError = OAuthSignInError;
/**
 * Happens when the login by an [Email provider](https://authjs.dev/getting-started/authentication/email) could not be started.
 *
 * Possible causes are:
 * - The email sent from the client is invalid, could not be normalized by [`EmailConfig.normalizeIdentifier`](https://authjs.dev/reference/core/providers/email#normalizeidentifier)
 * - The provided email/token combination has expired:
 *   Ask the user to log in again.
 * - There was an error with the database:
 *   Check the database logs.
 */
var EmailSignInError = /** @class */ (function (_super) {
    __extends(EmailSignInError, _super);
    function EmailSignInError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EmailSignInError.type = "EmailSignInError";
    return EmailSignInError;
}(SignInError));
exports.EmailSignInError = EmailSignInError;
/**
 * Represents an error that occurs during the sign-out process. This error
 * is logged when there are issues in terminating a user's session, either
 * by failing to delete the session from the database (in database session
 * strategies) or encountering issues during other parts of the sign-out
 * process, such as emitting sign-out events or clearing session cookies.
 *
 * The session cookie(s) are emptied even if this error is logged.
 *
 */
var SignOutError = /** @class */ (function (_super) {
    __extends(SignOutError, _super);
    function SignOutError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SignOutError.type = "SignOutError";
    return SignOutError;
}(AuthError));
exports.SignOutError = SignOutError;
/**
 * Auth.js was requested to handle an operation that it does not support.
 *
 * See [`AuthAction`](https://authjs.dev/reference/core/types#authaction) for the supported actions.
 */
var UnknownAction = /** @class */ (function (_super) {
    __extends(UnknownAction, _super);
    function UnknownAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UnknownAction.type = "UnknownAction";
    return UnknownAction;
}(AuthError));
exports.UnknownAction = UnknownAction;
/**
 * Thrown when a Credentials provider is present but the JWT strategy (`strategy: "jwt"`) is not enabled.
 *
 * Learn more at [`strategy`](https://authjs.dev/reference/core#strategy) or [Credentials provider](https://authjs.dev/getting-started/authentication/credentials)
 */
var UnsupportedStrategy = /** @class */ (function (_super) {
    __extends(UnsupportedStrategy, _super);
    function UnsupportedStrategy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UnsupportedStrategy.type = "UnsupportedStrategy";
    return UnsupportedStrategy;
}(AuthError));
exports.UnsupportedStrategy = UnsupportedStrategy;
/** Thrown when an endpoint was incorrectly called without a provider, or with an unsupported provider. */
var InvalidProvider = /** @class */ (function (_super) {
    __extends(InvalidProvider, _super);
    function InvalidProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InvalidProvider.type = "InvalidProvider";
    return InvalidProvider;
}(AuthError));
exports.InvalidProvider = InvalidProvider;
/**
 * Thrown when the `trustHost` option was not set to `true`.
 *
 * Auth.js requires the `trustHost` option to be set to `true` since it's relying on the request headers' `host` value.
 *
 * :::note
 * Official Auth.js libraries might attempt to automatically set the `trustHost` option to `true` if the request is coming from a trusted host on a trusted platform.
 * :::
 *
 * Learn more at [`trustHost`](https://authjs.dev/reference/core#trusthost) or [Guide: Deployment](https://authjs.dev/getting-started/deployment)
 */
var UntrustedHost = /** @class */ (function (_super) {
    __extends(UntrustedHost, _super);
    function UntrustedHost() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UntrustedHost.type = "UntrustedHost";
    return UntrustedHost;
}(AuthError));
exports.UntrustedHost = UntrustedHost;
/**
 * The user's email/token combination was invalid.
 * This could be because the email/token combination was not found in the database,
 * or because the token has expired. Ask the user to log in again.
 */
var Verification = /** @class */ (function (_super) {
    __extends(Verification, _super);
    function Verification() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Verification.type = "Verification";
    return Verification;
}(AuthError));
exports.Verification = Verification;
/**
 * Error for missing CSRF tokens in client-side actions (`signIn`, `signOut`, `useSession#update`).
 * Thrown when actions lack the double submit cookie, essential for CSRF protection.
 *
 * CSRF ([Cross-Site Request Forgery](https://owasp.org/www-community/attacks/csrf))
 * is an attack leveraging authenticated user credentials for unauthorized actions.
 *
 * Double submit cookie pattern, a CSRF defense, requires matching values in a cookie
 * and request parameter. More on this at [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Security/CSRF).
 */
var MissingCSRF = /** @class */ (function (_super) {
    __extends(MissingCSRF, _super);
    function MissingCSRF() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MissingCSRF.type = "MissingCSRF";
    return MissingCSRF;
}(SignInError));
exports.MissingCSRF = MissingCSRF;
var clientErrors = new Set([
    "CredentialsSignin",
    "OAuthAccountNotLinked",
    "OAuthCallbackError",
    "AccessDenied",
    "Verification",
    "MissingCSRF",
    "AccountNotLinked",
    "WebAuthnVerificationError",
]);
/**
 * Used to only allow sending a certain subset of errors to the client.
 * Errors are always logged on the server, but to prevent leaking sensitive information,
 * only a subset of errors are sent to the client as-is.
 * @internal
 */
function isClientError(error) {
    if (error instanceof AuthError)
        return clientErrors.has(error.type);
    return false;
}
exports.isClientError = isClientError;
/**
 * Thrown when multiple providers have `enableConditionalUI` set to `true`.
 * Only one provider can have this option enabled at a time.
 */
var DuplicateConditionalUI = /** @class */ (function (_super) {
    __extends(DuplicateConditionalUI, _super);
    function DuplicateConditionalUI() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DuplicateConditionalUI.type = "DuplicateConditionalUI";
    return DuplicateConditionalUI;
}(AuthError));
exports.DuplicateConditionalUI = DuplicateConditionalUI;
/**
 * Thrown when a WebAuthn provider has `enableConditionalUI` set to `true` but no formField has `webauthn` in its autocomplete param.
 *
 * The `webauthn` autocomplete param is required for conditional UI to work.
 */
var MissingWebAuthnAutocomplete = /** @class */ (function (_super) {
    __extends(MissingWebAuthnAutocomplete, _super);
    function MissingWebAuthnAutocomplete() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MissingWebAuthnAutocomplete.type = "MissingWebAuthnAutocomplete";
    return MissingWebAuthnAutocomplete;
}(AuthError));
exports.MissingWebAuthnAutocomplete = MissingWebAuthnAutocomplete;
/**
 * Thrown when a WebAuthn provider fails to verify a client response.
 */
var WebAuthnVerificationError = /** @class */ (function (_super) {
    __extends(WebAuthnVerificationError, _super);
    function WebAuthnVerificationError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebAuthnVerificationError.type = "WebAuthnVerificationError";
    return WebAuthnVerificationError;
}(AuthError));
exports.WebAuthnVerificationError = WebAuthnVerificationError;
/**
 * Thrown when an Email address is already associated with an account
 * but the user is trying an account that is not linked to it.
 *
 * For security reasons, Auth.js does not automatically link accounts to existing accounts if the user is not signed in.
 */
var AccountNotLinked = /** @class */ (function (_super) {
    __extends(AccountNotLinked, _super);
    function AccountNotLinked() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AccountNotLinked.type = "AccountNotLinked";
    return AccountNotLinked;
}(SignInError));
exports.AccountNotLinked = AccountNotLinked;
/**
 * Thrown when an experimental feature is used but not enabled.
 */
var ExperimentalFeatureNotEnabled = /** @class */ (function (_super) {
    __extends(ExperimentalFeatureNotEnabled, _super);
    function ExperimentalFeatureNotEnabled() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExperimentalFeatureNotEnabled.type = "ExperimentalFeatureNotEnabled";
    return ExperimentalFeatureNotEnabled;
}(AuthError));
exports.ExperimentalFeatureNotEnabled = ExperimentalFeatureNotEnabled;
