'use client';

import { totalSteps } from "@/lib/steps";
import css from './ProgressBar.module.scss';
import { useAppSelector } from "@/store/hooks";

export default function ProgressBar() {
    const currentStep = useAppSelector((state) => state.progress.currentStep);

    const progressPercent = Number((currentStep / totalSteps * 100).toFixed(2));

    return (
        <div className={css.root}>
            <div
                className={css.rootFiller}
                style={{ width: `${progressPercent}%` }}
            />
        </div>
    )
}
