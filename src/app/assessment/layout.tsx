import ProgressBar from '@/app/components/ui/ProgressBar/ProgressBar';
import StepNavigator from '../components/common/StepNavigator/StepNavigator';
import css from './layout.module.scss';
import { ImagesProvider } from './context/ImagesContext';

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={css.root}>
            <div className={css.rootWrapper}>
                <header>
                    <ProgressBar />
                </header>

                <ImagesProvider>
                    <main className={css.rootMain}>
                        {children}

                        <StepNavigator />
                    </main>
                </ImagesProvider>
            </div>
        </div>
    )
}
