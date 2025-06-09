import PageData from '@/data/index.json';
import Button from './components/ui/Button/Button';
import css from './page.module.scss';
import SafeHtml from './components/common/SafeHtml/SafeHtml';

export default function WelcomePage() {
    const { title, startButton } = PageData.welcomePage;

    return (
        <main className={css.root}>
            <div className={css.rootContent}>
                <SafeHtml className={`heading ${css.rootTitle}`} html={title} as="h1" />
                <Button className={`start-button ${css.rootButton}`} {...startButton} />
            </div>
        </main>
    );
}
