import PageData from '@/data/index.json';
import Button from './components/ui/Button/Button';
import css from './page.module.scss';

export default function WelcomePage() {
    const { title, startButton } = PageData.welcomePage;

    return (
        <main className={css.root}>
            <div className={css.rootContent}>
                <h1 className={`heading ${css.rootTitle}`}>
                    {title.map((line) => (
                        <span className={css.rootTitleLine} key={line.text}>{line.text}</span>
                    ))}
                </h1>
                <Button className={`start-button ${css.rootButton}`} {...startButton} />
            </div>
        </main>
    );
}
