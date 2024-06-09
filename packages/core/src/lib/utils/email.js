"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.text = exports.html = void 0;
/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
function html(params) {
    var url = params.url, host = params.host, theme = params.theme;
    var escapedHost = host.replace(/\./g, "&#8203;.");
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    var brandColor = theme.brandColor || "#346df1";
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    var buttonText = theme.buttonText || "#fff";
    var color = {
        background: "#f9f9f9",
        text: "#444",
        mainBackground: "#fff",
        buttonBackground: brandColor,
        buttonBorder: brandColor,
        buttonText: buttonText,
    };
    return "\n<body style=\"background: ".concat(color.background, ";\">\n  <table width=\"100%\" border=\"0\" cellspacing=\"20\" cellpadding=\"0\"\n    style=\"background: ").concat(color.mainBackground, "; max-width: 600px; margin: auto; border-radius: 10px;\">\n    <tr>\n      <td align=\"center\"\n        style=\"padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ").concat(color.text, ";\">\n        Sign in to <strong>").concat(escapedHost, "</strong>\n      </td>\n    </tr>\n    <tr>\n      <td align=\"center\" style=\"padding: 20px 0;\">\n        <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n          <tr>\n            <td align=\"center\" style=\"border-radius: 5px;\" bgcolor=\"").concat(color.buttonBackground, "\"><a href=\"").concat(url, "\"\n                target=\"_blank\"\n                style=\"font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ").concat(color.buttonText, "; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ").concat(color.buttonBorder, "; display: inline-block; font-weight: bold;\">Sign\n                in</a></td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n    <tr>\n      <td align=\"center\"\n        style=\"padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ").concat(color.text, ";\">\n        If you did not request this email you can safely ignore it.\n      </td>\n    </tr>\n  </table>\n</body>\n");
}
exports.html = html;
/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text(_a) {
    var url = _a.url, host = _a.host;
    return "Sign in to ".concat(host, "\n").concat(url, "\n\n");
}
exports.text = text;
