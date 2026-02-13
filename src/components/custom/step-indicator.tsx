import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
    number: number;
    title: string;
    subtitle?: string;
}

interface StepIndicatorProps {
    currentStep: number;
    steps: Step[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
    return (
        <div className="w-full mb-8">
            <div className="flex items-center justify-between max-w-2xl ">
                {steps.map((step, index) => {
                    const isCompleted = step.number < currentStep;
                    const isActive = step.number === currentStep;

                    return (
                        <div key={step.number} className="flex items-center flex-1">
                            {/* Step Circle */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                                        isCompleted && "bg-primary text-primary-foreground",
                                        isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                                        !isCompleted && !isActive && "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <span>{step.number}</span>
                                    )}
                                </div>
                                <div className="mt-2 text-center">
                                    <p className={cn(
                                        "text-sm font-medium",
                                        isActive ? "text-primary" : "text-muted-foreground"
                                    )}>
                                        {step.title}
                                    </p>
                                    {step.subtitle && (
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {step.subtitle}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-0.5 mx-4 -mt-12">
                                    <div
                                        className={cn(
                                            "h-full transition-all",
                                            step.number < currentStep ? "bg-primary" : "bg-muted"
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
