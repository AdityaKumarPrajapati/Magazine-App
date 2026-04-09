// useFormMacro.ts
import { useState, useCallback } from "react";

export const useFormMacro = (
    setData: React.Dispatch<React.SetStateAction<any>>,
    prefixMap: Record<string, string> = {}
) => {
    const [isRecording, setIsRecording] = useState(false);
    const [macroName, setMacroName] = useState("");
    const [showMacroPopup, setShowMacroPopup] = useState(false);
    const [recordingBuffer, setRecordingBuffer] = useState<any>({});

    const startRecording = (name: string) => {
        if (!name.trim()) return;
        setMacroName(name);
        setRecordingBuffer({});
        setIsRecording(true);
        setShowMacroPopup(false);
    };

    const stopAndSaveMacro = () => {
        if (!isRecording) return;
        const allMacros = JSON.parse(localStorage.getItem("app_macros") || "{}");
        
        // Save using the unique name provided at the start
        allMacros[macroName] = {
            data: recordingBuffer,
            timestamp: Date.now()
        };
        
        localStorage.setItem("app_macros", JSON.stringify(allMacros));
        setIsRecording(false);
        setMacroName("");
    };

    const applyMacroByName = (name: string) => {
        const allMacros = JSON.parse(localStorage.getItem("app_macros") || "{}");
        const targetMacro = allMacros[name];

        if (!targetMacro) return alert("Macro not found.");

        setData((prev: any) => {
            const newState = { ...prev };
            const dataToApply = targetMacro.data;

            Object.keys(dataToApply).forEach((key) => {
                if (typeof dataToApply[key] === "object" && dataToApply[key] !== null && prev[key]) {
                    newState[key] = { ...prev[key], ...dataToApply[key] };
                } else {
                    newState[key] = dataToApply[key];
                }
            });
            return newState;
        });
    };

    const recordField = useCallback((name: string, value: any) => {
        if (!isRecording) return;

        setRecordingBuffer((prev: any) => {
            const newBuffer = { ...prev };
            const prefix = Object.keys(prefixMap).find((p) => name.startsWith(p));

            if (prefix) {
                const nestedKey = prefixMap[prefix];
                const actualFieldName = name.replace(prefix, "");
                newBuffer[nestedKey] = {
                    ...(newBuffer[nestedKey] || {}),
                    [actualFieldName]: value,
                };
            } else {
                newBuffer[name] = value;
            }
            return newBuffer;
        });
    }, [isRecording, prefixMap]);

    return {
        isRecording,
        showMacroPopup,
        setShowMacroPopup,
        startRecording,
        stopAndSaveMacro,
        applyMacroByName,
        recordField,
    };
};