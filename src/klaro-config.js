/*
By default, Klaro will load the config from a global 'klaroConfig' variable. You can change this by specifying the 'data-klaro-config' attribute on your script: <script src="klaro.js" data-klaro-config="myConfigVariableName"
*/
export default {
    /*
    Setting 'testing' to 'true' will cause Klaro to not show the consent notice or
    modal by default, except if a special hash tag is appended to the URL (#klaro-
    testing). This makes it possible to test Klaro on your live website without
    affecting normal visitors.
    */
    testing: false,

    /*
    You can customize the ID of the DIV element that Klaro will create when starting
    up. By default, Klaro will use 'klaro'.
    */
    elementID: 'klaro',

    /*
    You can customize how Klaro persists consent information in the browser. Specify
    either cookie' (the default) or 'localStorage'.
    */
    storageMethod: 'cookie',

    /*
    You can customize the name of the cookie or localStorage entry that Klaro will
    use for storing the consent information. By default, Klaro will use 'klaro'.
    */
    storageName: 'klaro',

    /*
    If set to `true`, Klaro will render the texts given in the
    `consentModal.description` and `consentNotice.description` translations as HTML.
    This enables you to e.g. add custom links or interactive content.
    */
    htmlTexts: true,

    /*
    You can change the cookie domain for the consent manager itself. Use this if you
    want to get consent once for multiple matching domains. By default, Klaro will
    use the current domain. Only relevant if 'storageMethod' is set to 'cookie'.
    */
    // cookieDomain: '.example.com',

    /*
    You can also set a custom expiration time for the Klaro cookie. By default, it
    will expire after 30 days. Only relevant if 'storageMethod' is set to 'cookie'.
    */
    cookieExpiresAfterDays: 60,

    /*
    Defines the default state for services in the consent modal (true=enabled by
    default). You can override this setting in each service.
    */
    default: false,

    /*
    If 'mustConsent' is set to 'true', Klaro will directly display the consent
    manager modal and not allow the user to close it before having actively
    consented or declined the use of third-party services.
    */
    mustConsent: false,

    /*
    Setting 'acceptAll' to 'true' will show an "accept all" button in the notice and
    modal, which will enable all third-party services if the user clicks on it. If
    set to 'false', there will be an "accept" button that will only enable the
    services that are enabled in the consent modal.
    */
    acceptAll: true,

    /*
    Setting 'hideDeclineAll' to 'true' will hide the "decline" button in the consent
    modal and force the user to open the modal in order to change his/her consent or
    disable all third-party services. We strongly advise you to not use this
    feature, as it opposes the "privacy by default" and "privacy by design"
    principles of the GDPR (but might be acceptable in other legislations such as
    under the CCPA)
    */
    hideDeclineAll: true,

    /*
    Setting 'hideLearnMore' to 'true' will hide the "learn more / customize" link in
    the consent notice. We strongly advise against using this under most
    circumstances, as it keeps the user from customizing his/her consent choices.
    */
    hideLearnMore: false,

    /*
    You can overwrite existing translations and add translations for your service
    descriptions and purposes. See `src/translations/` for a full list of
    translations that can be overwritten:
    https://github.com/KIProtect/klaro/tree/master/src/translations
    */
    translations: {
        // translationsed defined under the 'zz' language code act as default
        // translations.
        zz: {
            privacyPolicyUrl: '/privacy',
        },
        // If you erase the "consentModal" translations, Klaro will use the
        // bundled translations.
        de: {
            privacyPolicyUrl: '/datenschutz',
            consentModal: {
                description:
                    'Hier kannst Du einsehen und anpassen, welche Information wir über Dich sammeln.',
            },
            inlineTracker: {
                description: 'Beispiel für ein Inline-Tracking Skript',
            },
            externalTracker: {
                description: 'Beispiel für ein externes Tracking Skript',
            },
            consentNotice: {
                changeDescription: `Seit Deinem letzten Besuch gab es Änderungen, bitte erneuere Deine Zustimmung.`,
                description: `👋 Hallo! Dürfen wir Deine Einstellungen bis zum nächsten Besuch zwischenspeichern? Du kannst Deine Zustimmung später jederzeit zurückziehen.`,
                learnMore: `Ich möchte wählen`,
            },

            contextualConsent: {
                description: `Möchtest Du von {title} bereitgestellte externe Inhalte laden?`,
            },
            privacyPolicy: {
                text: `Um mehr zu erfahren, lese bitte unsere {privacyPolicy}.`,
            },
            purposes: {
                functional: {
                    description: `Diese Dienste sind für die korrekte Funktion dieser Website
                    unerlässlich. Du kannst sie hier nicht deaktivieren, da der Dienst sonst
                    nicht richtig funktionieren würde.`,
                },
                marketing: {
                    description: `Diese Dienste verarbeiten persönliche Daten, um Dir relevante Inhalte
                        über Produkte, Dienstleistungen oder Themen zu zeigen, die Dich interessieren
                        könnten.`,
                },
                analytics: 'Besucher-Statistiken',
                security: 'Sicherheit',
                livechat: 'Live Chat',
                advertising: 'Anzeigen von Werbung',
                styling: 'Styling',
            },
            service: {
                disableAll: {
                    description: `Mit diesem Schalter kannst Du alle Dienste aktivieren oder deaktivieren.`,
                },
                optOut: {
                    description: `Diese Dienste werden standardmäßig geladen (Du kannst Dich jedoch
                    abmelden)`,
                },
            },

            // adsense: {
            //     description: 'Anzeigen von Werbeanzeigen (Beispiel)',
            //     title: 'Google AdSense Werbezeugs',
            // },
            // matomo: {
            //     description: 'Sammeln von Besucherstatistiken',
            // },
            // camera: {
            //     description:
            //         'Eine Überwachungskamera (nur ein Beispiel zu IMG-Tags)',
            // },
            // cloudflare: {
            //     description: 'Schutz gegen DDoS-Angriffe',
            // },
            // intercom: {
            //     description:
            //         'Chat Widget & Sammeln von Besucherstatistiken (nur ein Beispiel)',
            // },
            // mouseflow: {
            //     description: 'Echtzeit-Benutzeranalyse (nur ein Beispiel)',
            // },
            // googleFonts: {
            //     description: 'Web-Schriftarten von Google gehostet',
            // },
        },
        en: {
            consentModal: {
                title: '<u>test</u>',
                description:
                    'Here you can see and customize the information that we collect about you.',
            },
            inlineTracker: {
                description: 'Example of an inline tracking script',
            },
            externalTracker: {
                description: 'Example of an external tracking script',
            },
            // adsense: {
            //     description: 'Displaying of advertisements (just an example)',
            //     title: 'Google Adsense Advertisement',
            // },
            // matomo: {
            //     description: 'Collecting of visitor statistics',
            // },
            // camera: {
            //     description:
            //         'A surveillance camera (just an example for an IMG tag)',
            // },
            // cloudflare: {
            //     description: 'Protection against DDoS attacks',
            // },
            // intercom: {
            //     description:
            //         'Chat widget & collecting of visitor statistics (just an example)',
            // },
            // mouseflow: {
            //     description: 'Real-Time user analytics (just an example)',
            // },
            // googleFonts: {
            //     description: 'Web fonts hosted by Google',
            // },
            purposes: {
                analytics: 'Analytics',
                security: 'Security',
                livechat: 'Livechat',
                advertising: 'Advertising',
                styling: 'Styling',
            },
        },
    },

    // This is a list of third-party services that Klaro will manage for you.
    services: [
        {
            name: 'Einstellungen bis zum nächsten Besuch merken',
            default: true,
            contextualConsentOnly: false,
            purposes: ['functional'],
        },
        // {
        //     name: 'youtube',
        //     default: true,
        //     purposes: ['marketing'],
        // },
        // {
        //     // Each service should have a unique (and short) name.
        //     name: 'matomo',
        //     // If "default" is set to true, the service will be enabled by default
        //     // Overwrites global "default" setting.
        //     // We recommend leaving this to "false" for services that collect
        //     // personal information.
        //     default: true,
        //     // The title of your service as listed in the consent modal.
        //     title: 'Matomo/Piwik',
        //     // The purpose(s) of this service. Will be listed on the consent notice.
        //     // Do not forget to add translations for all purposes you list here.
        //     purposes: ['analytics'],
        //     // A list of regex expressions or strings giving the names of
        //     // cookies set by this service. If the user withdraws consent for a
        //     // given service, Klaro will then automatically delete all matching
        //     // cookies.
        //     cookies: [
        //         // you can also explicitly provide a path and a domain for
        //         // a given cookie. This is necessary if you have services that
        //         // set cookies for a path that is not "/" or a domain that
        //         // is not the current domain. If you do not set these values
        //         // properly, the cookie can't be deleted by Klaro
        //         // (there is no way to access the path or domain of a cookie in JS)
        //         // Notice that it is not possible to delete cookies that were set
        //         // on a third-party domain! See the note at mdn:
        //         // https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#new-cookie_domain
        //         [/^_pk_.*$/, '/', 'klaro.kiprotect.com'], // for the production version
        //         [/^_pk_.*$/, '/', 'localhost'], // for the local version
        //         'piwik_ignore',
        //     ],
        //     // An optional callback function that will be called each time
        //     // the consent state for the service changes (true=consented). Passes
        //     // the `service` config as the second parameter as well.
        //     callback(consent, service) {
        //         // This is an example callback function.
        //         console.log(
        //             `User consent for service ${  service.name  }: consent=${  consent}`
        //         );
        //         // To be used in conjunction with Matomo 'requireCookieConsent' Feature, Matomo 3.14.0 or newer
        //         // For further Information see https://matomo.org/faq/new-to-piwik/how-can-i-still-track-a-visitor-without-cookies-even-if-they-decline-the-cookie-consent/
        //         /*
        //         if(consent==true){
        //             _paq.push(['rememberCookieConsentGiven']);
        //         } else {
        //             _paq.push(['forgetCookieConsentGiven']);
        //         }
        //         */
        //     },
        //     // If "required" is set to true, Klaro will not allow this service to
        //     // be disabled by the user.
        //     required: false,
        //     // If "optOut" is set to true, Klaro will load this service even before
        //     // the user gave explicit consent.
        //     // We recommend always leaving this "false".
        //     optOut: false,
        //     // If "onlyOnce" is set to true, the service will only be executed
        //     // once regardless how often the user toggles it on and off.
        //     onlyOnce: true,
        // },
        // The services will appear in the modal in the same order as defined here.
        // {
        //     name: 'inlineTracker',
        //     title: 'Inline Tracker',
        //     purposes: ['analytics'],
        //     cookies: ['inline-tracker'],
        //     optOut: false,
        // },
        // {
        //     name: 'externalTracker',
        //     title: 'External Tracker',
        //     purposes: ['analytics', 'security'],
        //     cookies: ['external-tracker'],
        // },
        // {
        //     name: 'intercom',
        //     title: 'Intercom',
        //     default: true,
        //     purposes: ['livechat'],
        // },
        // {
        //     name: 'mouseflow',
        //     title: 'Mouseflow',
        //     purposes: ['analytics'],
        // },
        // {
        //     name: 'adsense',
        //     // if you omit the title here Klaro will try to look it up in the
        //     // translations
        //     // title: 'Google AdSense',
        //     purposes: ['advertising'],
        // },
        // {
        //     name: 'camera',
        //     title: 'Surveillance Camera',
        //     purposes: ['security'],
        // },
        /*        {
            name: 'googleFonts',
            title: 'Google Fonts',
            purposes: ['styling'],
        }, */
        // {
        //     name: 'cloudflare',
        //     title: 'Cloudflare',
        //     purposes: ['security'],
        //     required: true,
        // },
    ],
}
