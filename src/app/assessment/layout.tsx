import ProgressBar from '@/app/components/ui/ProgressBar/ProgressBar';
import StepNavigator from '../components/common/StepNavigator/StepNavigator';
import css from './layout.module.scss';
import { ImagesProvider } from './context/ImagesContext';

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={css.root}>
            <div className={css.rootWrapper}>
                <ProgressBar />

                <ImagesProvider>
                    <div className={css.rootContainer}>
                        {children}

                        <StepNavigator />
                    </div>
                </ImagesProvider>
            </div>
        </div>
    )
}
