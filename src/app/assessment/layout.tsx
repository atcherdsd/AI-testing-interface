import ProgressBar from '@/app/components/ui/ProgressBar/ProgressBar';
import StepNavigator from '../components/common/StepNavigator/StepNavigator';
import css from './layout.module.scss';

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={css.root}>
            <ProgressBar />

            <div className={css.rootContent}>
                {children}
            </div>

            <StepNavigator />
        </div>
    )
}
