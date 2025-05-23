import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState, useCallback } from "react";
import { showErrorToast } from "../components/toast";

export const useUserForm = ({
    defaultValues,
    onSubmit,
}: {
    defaultValues?: Record<string, unknown>;
    onSubmit: SubmitHandler<Record<string, unknown>>;
}) => {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ defaultValues, mode: "onChange" });

    /* map visibility password */
    const [showPwdMap, setShowPwdMap] = useState<Record<string, boolean>>({});
    const toggleShowPassword = useCallback(
        (name: string) =>
            setShowPwdMap(prev => ({ ...prev, [name]: !prev[name] })),
        []
    );

    /* NIK */
    const [nikStatus, setNikStatus] = useState<"valid" | "invalid" | "checking" | null>(null);
    const checkNik = useCallback(async (nik: string) => {
        if (!nik) return;
        setNikStatus("checking");
        try {
            const res = await fetch(`/api/check-nik?nik=${nik}`);
            const { exists } = await res.json();
            setNikStatus(exists ? "valid" : "invalid");
        } catch {
            setNikStatus("invalid");
        }
    }, []);

    const submitInternal: SubmitHandler<Record<string, unknown>> = data => {
        if (nikStatus === "invalid") {
            showErrorToast("NIK tidak ditemukan.");
            return;
        }
        onSubmit(data);
    };

    useEffect(() => {
        if (defaultValues) reset(defaultValues);
    }, [defaultValues, reset]);

    return {
        register,
        control,
        errors,
        handleSubmit: handleSubmit(submitInternal),
        showPwdMap,
        toggleShowPassword,
        nikStatus,
        checkNik,
        setNikStatus,
    };
};
