'use client';

import { totalSteps } from "@/lib/steps";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import css from './ProgressBar.module.scss';

export default function ProgressBar() {
    const currentStep = useSelector((state: RootState) => state.progress.currentStep);

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
