import React, { createContext, useContext, useState } from 'react';

interface SignupData {
    // User info
    full_name: string;
    email: string;
    password: string;
    phone: string;
    // Farm info
    business_name: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    // Business hours
    business_hours: string;
    // OTP
    otp: string;
}

interface SignupContextType {
    signupData: SignupData;
    updateSignupData: (data: Partial<SignupData>) => void;
    resetSignupData: () => void;
}

const defaultSignupData: SignupData = {
    full_name: '',
    email: '',
    password: '',
    phone: '',
    business_name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    business_hours: '',
    otp: '',
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export function SignupProvider({ children }: { children: React.ReactNode }) {
    const [signupData, setSignupData] = useState<SignupData>(defaultSignupData);

    const updateSignupData = (data: Partial<SignupData>) => {
        setSignupData((prev) => ({ ...prev, ...data }));
    };

    const resetSignupData = () => {
        setSignupData(defaultSignupData);
    };

    return (
        <SignupContext.Provider value={{ signupData, updateSignupData, resetSignupData }}>
            {children}
        </SignupContext.Provider>
    );
}

export function useSignupContext() {
    const context = useContext(SignupContext);
    if (!context) {
        throw new Error('useSignupContext must be used within a SignupProvider');
    }
    return context;
}
