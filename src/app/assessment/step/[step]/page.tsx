'use client';

import { setStep } from "@/store/slices/progessSlice";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { stepComponents, StepId } from "@/lib/stepMap";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function StepPage() {
    const params = useParams();
    const dispatch = useAppDispatch();
    const currentStep = useAppSelector((state) => state.progress.currentStep);

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

    return <StepComponent />
}
