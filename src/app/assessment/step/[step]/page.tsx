'use client';

import { setStep } from "@/store/slices/progessSlice";
import { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { stepComponents, StepId } from "@/lib/stepMap";

export default function StepPage() {
    const params = useParams();
    const dispatch = useDispatch();
    const currentStep = useSelector((state: RootState) => state.progress.currentStep);

    const stepFromUrl = parseInt(params.step as string, 10) as StepId;

    useEffect(() => {
        if (!isNaN(stepFromUrl) && stepFromUrl !== currentStep) {
            dispatch(setStep(stepFromUrl));
        }
    }, [stepFromUrl, currentStep, dispatch]);

    if (isNaN(stepFromUrl)) {
        return <p>Некорректный шаг</p>;
    }

    const StepComponent = stepComponents[stepFromUrl];

    if (!StepComponent) {
        return <p>Шаг не найден</p>
    }

    return (
        <section>
            <StepComponent />
        </section>
    )
}
