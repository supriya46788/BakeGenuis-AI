// Multi-Language Support System for BakeGenius.ai
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
        this.translations = {};
        this.loadTranslations();
    }

    // Language translations database
    loadTranslations() {
        this.translations = {
            en: {
                // Navigation
                'nav.home': 'Home',
                'nav.convert': 'Convert Recipe',
                'nav.customize': 'Customize',
                'nav.recipehub': 'Recipe Hub',
                'nav.about': 'About',
                'nav.login': 'Login',
                'nav.signup': 'Sign Up',
                'nav.scale': 'Scale Now',
                'nav.language': 'Language',

                // Home Page
                'home.title': 'Welcome to BakeGenius.ai',
                'home.subtitle': 'From spoon to scale — get exact gram conversions with AI magic ✨<br>Transform vague recipe measurements into precise, consistent results every time!',
                'home.cta': 'Start Converting Now 🚀',
                'home.feature1.title': 'AI-Powered Precision',
                'home.feature1.desc': 'Advanced AI converts "cups" and "spoons" into exact gram measurements for perfect baking every time.',
                'home.feature2.title': 'Smart Recipe Scaling',
                'home.feature2.desc': 'Effortlessly scale recipes up or down while maintaining perfect ratios and adjusting rising agents intelligently.',
                'home.feature3.title': 'Custom Preferences',
                'home.feature3.desc': 'Personalize conversions based on your preferred brands and ingredient specifications for consistent results.',

                // Footer
                'footer.brand.desc': 'Baking meets AI — recipes, ideas, and inspiration to make your creations magical!',
                'footer.links': 'Links',
                'footer.newsletter': 'Newsletter',
                'footer.newsletter.desc': 'Get the latest baking tips & AI recipes!',
                'footer.newsletter.placeholder': 'Your email',
                'footer.newsletter.subscribe': 'Subscribe',
                'footer.social': 'Follow Us',
                'footer.copyright': '© 2025 BakeGenius.ai — All rights reserved.',

                // Convert Page
                'convert.title': '🧪 Recipe Converter',
                'convert.subtitle': 'Transform your recipes into precise gram measurements with AI magic',
                'convert.input.label': '📝 Paste your recipe here:',
                'convert.input.placeholder': 'Example:\n2 cups all-purpose flour\n1 cup packed brown sugar\n1/2 cup melted butter\n2 large eggs\n1 tsp vanilla extract',
                'convert.button': '✨ Convert to Grams',
                'convert.output.title': '📊 Converted Recipe',

                // Customize Page
                'customize.title': '🎨 Customize Your Recipe',
                'customize.subtitle': 'Fine-tune ingredient densities and measurement types for perfect baking precision!',
                'customize.brand.title': '🏷️ Choose Your Preferred Brand',
                'customize.brand.standard': 'Standard/Generic',

                // Scale Page
                'scale.title': '⚖️ Scale Your Recipe',
                'scale.subtitle': 'Resize your recipes while maintaining perfect proportions',

                // Recipe Hub Page
                'recipehub.title': '📚 Recipe Hub',
                'recipehub.subtitle': 'Discover amazing baking recipes powered by AI',

                // Auth Pages
                'auth.login.title': 'Login to BakeGenius.ai',
                'auth.signup.title': 'Join BakeGenius.ai',
                'auth.email': 'Email',
                'auth.password': 'Password',
                'auth.login.button': 'Login',
                'auth.signup.button': 'Sign Up',
            },

            hi: {
                // Navigation
                'nav.home': 'होम',
                'nav.convert': 'रेसिपी कन्वर्ट करें',
                'nav.customize': 'कस्टमाइज़',
                'nav.recipehub': 'रेसिपी हब',
                'nav.about': 'हमारे बारे में',
                'nav.login': 'लॉगिन',
                'nav.signup': 'साइन अप',
                'nav.scale': 'स्केल करें',
                'nav.language': 'भाषा',

                // Home Page
                'home.title': 'BakeGenius.ai में आपका स्वागत है',
                'home.subtitle': 'चम्मच से पैमाने तक — AI जादू के साथ सटीक ग्राम रूपांतरण प्राप्त करें ✨<br>अस्पष्ट रेसिपी मापों को हर बार सटीक, सुसंगत परिणामों में बदलें!',
                'home.cta': 'अभी कन्वर्ट करना शुरू करें 🚀',
                'home.feature1.title': 'AI-संचालित परिशुद्धता',
                'home.feature1.desc': 'उन्नत AI "कप" और "चम्मच" को हर बार सही बेकिंग के लिए सटीक ग्राम माप में बदलता है।',
                'home.feature2.title': 'स्मार्ट रेसिपी स्केलिंग',
                'home.feature2.desc': 'सही अनुपात बनाए रखते हुए और उठाने वाले एजेंटों को समझदारी से समायोजित करते हुए आसानी से रेसिपी को ऊपर या नीचे स्केल करें।',
                'home.feature3.title': 'कस्टम प्राथमिकताएं',
                'home.feature3.desc': 'सुसंगत परिणामों के लिए अपने पसंदीदा ब्रांड और सामग्री विनिर्देशों के आधार पर रूपांतरण को व्यक्तिगत बनाएं।',

                // Footer
                'footer.brand.desc': 'बेकिंग AI से मिलती है — रेसिपी, विचार, और प्रेरणा आपकी रचनाओं को जादुई बनाने के लिए!',
                'footer.links': 'लिंक',
                'footer.newsletter': 'न्यूज़लेटर',
                'footer.newsletter.desc': 'नवीनतम बेकिंग टिप्स और AI रेसिपी प्राप्त करें!',
                'footer.newsletter.placeholder': 'आपका ईमेल',
                'footer.newsletter.subscribe': 'सब्सक्राइब करें',
                'footer.social': 'हमें फॉलो करें',
                'footer.copyright': '© 2025 BakeGenius.ai — सभी अधिकार सुरक्षित।',

                // Convert Page
                'convert.title': '🧪 रेसिपी कन्वर्टर',
                'convert.subtitle': 'AI जादू के साथ अपनी रेसिपी को सटीक ग्राम माप में बदलें',
                'convert.input.label': '📝 अपनी रेसिपी यहाँ पेस्ट करें:',
                'convert.input.placeholder': 'उदाहरण:\n2 कप ऑल-पर्पस आटा\n1 कप ब्राउन शुगर\n1/2 कप पिघला हुआ मक्खन\n2 बड़े अंडे\n1 चम्मच वनीला एक्सट्रैक्ट',
                'convert.button': '✨ ग्राम में कन्वर्ट करें',
                'convert.output.title': '📊 कन्वर्ट की गई रेसिपी',

                // Customize Page
                'customize.title': '🎨 अपनी रेसिपी कस्टमाइज़ करें',
                'customize.subtitle': 'सही बेकिंग परिशुद्धता के लिए सामग्री घनत्व और माप प्रकारों को ठीक करें!',
                'customize.brand.title': '🏷️ अपना पसंदीदा ब्रांड चुनें',
                'customize.brand.standard': 'मानक/सामान्य',

                // Scale Page
                'scale.title': '⚖️ अपनी रेसिपी स्केल करें',
                'scale.subtitle': 'सही अनुपात बनाए रखते हुए अपनी रेसिपी का आकार बदलें',

                // Recipe Hub Page
                'recipehub.title': '📚 रेसिपी हब',
                'recipehub.subtitle': 'AI द्वारा संचालित अद्भुत बेकिंग रेसिपी खोजें',

                // Auth Pages
                'auth.login.title': 'BakeGenius.ai में लॉगिन करें',
                'auth.signup.title': 'BakeGenius.ai में शामिल हों',
                'auth.email': 'ईमेल',
                'auth.password': 'पासवर्ड',
                'auth.login.button': 'लॉगिन',
                'auth.signup.button': 'साइन अप',
            },

            es: {
                // Navigation
                'nav.home': 'Inicio',
                'nav.convert': 'Convertir Receta',
                'nav.customize': 'Personalizar',
                'nav.recipehub': 'Centro de Recetas',
                'nav.about': 'Acerca de',
                'nav.login': 'Iniciar Sesión',
                'nav.signup': 'Registrarse',
                'nav.scale': 'Escalar Ahora',
                'nav.language': 'Idioma',

                // Home Page
                'home.title': 'Bienvenido a BakeGenius.ai',
                'home.subtitle': 'De cuchara a balanza — obtén conversiones exactas en gramos con la magia de la IA ✨<br>¡Transforma medidas vagas de recetas en resultados precisos y consistentes cada vez!',
                'home.cta': 'Comenzar a Convertir Ahora 🚀',
                'home.feature1.title': 'Precisión Impulsada por IA',
                'home.feature1.desc': 'La IA avanzada convierte "tazas" y "cucharadas" en medidas exactas en gramos para una horneada perfecta cada vez.',
                'home.feature2.title': 'Escalado Inteligente de Recetas',
                'home.feature2.desc': 'Escala recetas hacia arriba o hacia abajo sin esfuerzo mientras mantienes proporciones perfectas y ajustas agentes leudantes inteligentemente.',
                'home.feature3.title': 'Preferencias Personalizadas',
                'home.feature3.desc': 'Personaliza conversiones basadas en tus marcas preferidas y especificaciones de ingredientes para resultados consistentes.',

                // Footer
                'footer.brand.desc': '¡La repostería se encuentra con la IA — recetas, ideas e inspiración para hacer tus creaciones mágicas!',
                'footer.links': 'Enlaces',
                'footer.newsletter': 'Boletín',
                'footer.newsletter.desc': '¡Obtén los últimos consejos de repostería y recetas de IA!',
                'footer.newsletter.placeholder': 'Tu email',
                'footer.newsletter.subscribe': 'Suscribirse',
                'footer.social': 'Síguenos',
                'footer.copyright': '© 2025 BakeGenius.ai — Todos los derechos reservados.',

                // Convert Page
                'convert.title': '🧪 Convertidor de Recetas',
                'convert.subtitle': 'Transforma tus recetas en medidas precisas en gramos con la magia de la IA',
                'convert.input.label': '📝 Pega tu receta aquí:',
                'convert.input.placeholder': 'Ejemplo:\n2 tazas de harina para todo uso\n1 taza de azúcar morena compacta\n1/2 taza de mantequilla derretida\n2 huevos grandes\n1 cucharadita de extracto de vainilla',
                'convert.button': '✨ Convertir a Gramos',
                'convert.output.title': '📊 Receta Convertida',

                // Customize Page
                'customize.title': '🎨 Personaliza Tu Receta',
                'customize.subtitle': '¡Ajusta las densidades de ingredientes y tipos de medida para una precisión perfecta en repostería!',
                'customize.brand.title': '🏷️ Elige Tu Marca Preferida',
                'customize.brand.standard': 'Estándar/Genérica',

                // Scale Page
                'scale.title': '⚖️ Escala Tu Receta',
                'scale.subtitle': 'Redimensiona tus recetas manteniendo proporciones perfectas',

                // Recipe Hub Page
                'recipehub.title': '📚 Centro de Recetas',
                'recipehub.subtitle': 'Descubre increíbles recetas de repostería impulsadas por IA',

                // Auth Pages
                'auth.login.title': 'Inicia Sesión en BakeGenius.ai',
                'auth.signup.title': 'Únete a BakeGenius.ai',
                'auth.email': 'Email',
                'auth.password': 'Contraseña',
                'auth.login.button': 'Iniciar Sesión',
                'auth.signup.button': 'Registrarse',
            },

            fr: {
                // Navigation
                'nav.home': 'Accueil',
                'nav.convert': 'Convertir Recette',
                'nav.customize': 'Personnaliser',
                'nav.recipehub': 'Hub Recettes',
                'nav.about': 'À propos',
                'nav.login': 'Connexion',
                'nav.signup': 'Inscription',
                'nav.scale': 'Redimensionner',
                'nav.language': 'Langue',

                // Home Page
                'home.title': 'Bienvenue sur BakeGenius.ai',
                'home.subtitle': 'De la cuillère à la balance — obtenez des conversions exactes en grammes avec la magie de l\'IA ✨<br>Transformez les mesures vagues de recettes en résultats précis et cohérents à chaque fois !',
                'home.cta': 'Commencer à Convertir Maintenant 🚀',
                'home.feature1.title': 'Précision Alimentée par l\'IA',
                'home.feature1.desc': 'L\'IA avancée convertit les "tasses" et "cuillères" en mesures exactes en grammes pour une cuisson parfaite à chaque fois.',
                'home.feature2.title': 'Redimensionnement Intelligent de Recettes',
                'home.feature2.desc': 'Redimensionnez facilement les recettes vers le haut ou vers le bas tout en maintenant des proportions parfaites et en ajustant intelligemment les agents levants.',
                'home.feature3.title': 'Préférences Personnalisées',
                'home.feature3.desc': 'Personnalisez les conversions basées sur vos marques préférées et spécifications d\'ingrédients pour des résultats cohérents.',

                // Footer
                'footer.brand.desc': 'La pâtisserie rencontre l\'IA — recettes, idées et inspiration pour rendre vos créations magiques !',
                'footer.links': 'Liens',
                'footer.newsletter': 'Newsletter',
                'footer.newsletter.desc': 'Obtenez les derniers conseils de pâtisserie et recettes IA !',
                'footer.newsletter.placeholder': 'Votre email',
                'footer.newsletter.subscribe': 'S\'abonner',
                'footer.social': 'Suivez-nous',
                'footer.copyright': '© 2025 BakeGenius.ai — Tous droits réservés.',

                // Convert Page
                'convert.title': '🧪 Convertisseur de Recettes',
                'convert.subtitle': 'Transformez vos recettes en mesures précises en grammes avec la magie de l\'IA',
                'convert.input.label': '📝 Collez votre recette ici :',
                'convert.input.placeholder': 'Exemple :\n2 tasses de farine tout usage\n1 tasse de cassonade tassée\n1/2 tasse de beurre fondu\n2 gros œufs\n1 cuillère à café d\'extrait de vanille',
                'convert.button': '✨ Convertir en Grammes',
                'convert.output.title': '📊 Recette Convertie',

                // Customize Page
                'customize.title': '🎨 Personnalisez Votre Recette',
                'customize.subtitle': 'Ajustez finement les densités d\'ingrédients et types de mesures pour une précision de cuisson parfaite !',
                'customize.brand.title': '🏷️ Choisissez Votre Marque Préférée',
                'customize.brand.standard': 'Standard/Générique',

                // Scale Page
                'scale.title': '⚖️ Redimensionnez Votre Recette',
                'scale.subtitle': 'Redimensionnez vos recettes tout en maintenant des proportions parfaites',

                // Recipe Hub Page
                'recipehub.title': '📚 Hub Recettes',
                'recipehub.subtitle': 'Découvrez d\'incroyables recettes de pâtisserie alimentées par l\'IA',

                // Auth Pages
                'auth.login.title': 'Connectez-vous à BakeGenius.ai',
                'auth.signup.title': 'Rejoignez BakeGenius.ai',
                'auth.email': 'Email',
                'auth.password': 'Mot de passe',
                'auth.login.button': 'Connexion',
                'auth.signup.button': 'Inscription',
            },

            de: {
                // Navigation
                'nav.home': 'Startseite',
                'nav.convert': 'Rezept Konvertieren',
                'nav.customize': 'Anpassen',
                'nav.recipehub': 'Rezept-Hub',
                'nav.about': 'Über uns',
                'nav.login': 'Anmelden',
                'nav.signup': 'Registrieren',
                'nav.scale': 'Skalieren',
                'nav.language': 'Sprache',

                // Home Page
                'home.title': 'Willkommen bei BakeGenius.ai',
                'home.subtitle': 'Vom Löffel zur Waage — erhalten Sie exakte Gramm-Umrechnungen mit KI-Magie ✨<br>Verwandeln Sie vage Rezeptmengen jedes Mal in präzise, konsistente Ergebnisse!',
                'home.cta': 'Jetzt mit Konvertieren beginnen 🚀',
                'home.feature1.title': 'KI-betriebene Präzision',
                'home.feature1.desc': 'Fortgeschrittene KI konvertiert "Tassen" und "Löffel" in exakte Gramm-Messungen für perfektes Backen jedes Mal.',
                'home.feature2.title': 'Intelligente Rezept-Skalierung',
                'home.feature2.desc': 'Skalieren Sie Rezepte mühelos nach oben oder unten, während Sie perfekte Verhältnisse beibehalten und Triebmittel intelligent anpassen.',
                'home.feature3.title': 'Benutzerdefinierte Präferenzen',
                'home.feature3.desc': 'Personalisieren Sie Umrechnungen basierend auf Ihren bevorzugten Marken und Zutatenspefiikationen für konsistente Ergebnisse.',

                // Footer
                'footer.brand.desc': 'Backen trifft auf KI — Rezepte, Ideen und Inspiration, um Ihre Kreationen magisch zu machen!',
                'footer.links': 'Links',
                'footer.newsletter': 'Newsletter',
                'footer.newsletter.desc': 'Erhalten Sie die neuesten Back-Tipps und KI-Rezepte!',
                'footer.newsletter.placeholder': 'Ihre E-Mail',
                'footer.newsletter.subscribe': 'Abonnieren',
                'footer.social': 'Folgen Sie uns',
                'footer.copyright': '© 2025 BakeGenius.ai — Alle Rechte vorbehalten.',

                // Convert Page
                'convert.title': '🧪 Rezept-Konverter',
                'convert.subtitle': 'Verwandeln Sie Ihre Rezepte mit KI-Magie in präzise Gramm-Messungen',
                'convert.input.label': '📝 Fügen Sie Ihr Rezept hier ein:',
                'convert.input.placeholder': 'Beispiel:\n2 Tassen Allzweckmehl\n1 Tasse brauner Zucker\n1/2 Tasse geschmolzene Butter\n2 große Eier\n1 TL Vanilleextrakt',
                'convert.button': '✨ In Gramm konvertieren',
                'convert.output.title': '📊 Konvertiertes Rezept',

                // Customize Page
                'customize.title': '🎨 Passen Sie Ihr Rezept an',
                'customize.subtitle': 'Feinabstimmung von Zutatendichten und Messungstypen für perfekte Back-Präzision!',
                'customize.brand.title': '🏷️ Wählen Sie Ihre bevorzugte Marke',
                'customize.brand.standard': 'Standard/Generisch',

                // Scale Page
                'scale.title': '⚖️ Skalieren Sie Ihr Rezept',
                'scale.subtitle': 'Ändern Sie die Größe Ihrer Rezepte bei perfekten Proportionen',

                // Recipe Hub Page
                'recipehub.title': '📚 Rezept-Hub',
                'recipehub.subtitle': 'Entdecken Sie erstaunliche KI-betriebene Back-Rezepte',

                // Auth Pages
                'auth.login.title': 'Bei BakeGenius.ai anmelden',
                'auth.signup.title': 'Bei BakeGenius.ai registrieren',
                'auth.email': 'E-Mail',
                'auth.password': 'Passwort',
                'auth.login.button': 'Anmelden',
                'auth.signup.button': 'Registrieren',
            }
        };
    }

    // Get translation for a key
    t(key) {
        const translation = this.translations[this.currentLanguage]?.[key];
        return translation || this.translations['en'][key] || key;
    }

    // Set language and update UI
    setLanguage(langCode) {
        if (this.translations[langCode]) {
            this.currentLanguage = langCode;
            localStorage.setItem('preferredLanguage', langCode);
            this.updatePageContent();
            
            // Update language selector
            const languageSelect = document.getElementById('languageSelect');
            if (languageSelect) {
                languageSelect.value = langCode;
            }
        }
    }

    // Update all translatable content on the page
    updatePageContent() {
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translation;
            } else if (element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.innerHTML = translation;
            }
        });

        // Update page title if applicable
        const titleKey = document.body.getAttribute('data-page-title');
        if (titleKey) {
            document.title = this.t(titleKey) + ' - BakeGenius.ai';
        }
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Get available languages
    getAvailableLanguages() {
        return [
            { code: 'en', name: 'English', flag: '🇺🇸' },
            { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
            { code: 'es', name: 'Español', flag: '🇪🇸' },
            { code: 'fr', name: 'Français', flag: '🇫🇷' },
            { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
        ];
    }
}

// Initialize global language manager
window.languageManager = new LanguageManager();

// Initialize language functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Update content with saved language
    window.languageManager.updatePageContent();
    
    // Set up language selector if it exists
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = window.languageManager.getCurrentLanguage();
        languageSelect.addEventListener('change', function() {
            window.languageManager.setLanguage(this.value);
        });
    }
});
