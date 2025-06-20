import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';

function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        console.log('Language changed to:', lng);
    };

    return (
        <div className="language-switcher" style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}>
            <Button variant="outlined" onClick={() => changeLanguage('en')} sx={{ mr: 1 }}>
                English
            </Button>
            <Button variant="outlined" onClick={() => changeLanguage('vi')}>
                Tiếng Việt
            </Button>
        </div>
    );
}

export default LanguageSwitcher;