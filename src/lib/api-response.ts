import { NextResponse } from "next/server";
import { ApiSuccessResponse, ApiErrorResponse } from "@/types/api";

export const ApiSuccess = <T>(data: T, message: string, status = 200) => {
    return NextResponse.json<ApiSuccessResponse<T>>({ data, message }, { status });
};

export const ApiError = (error: string | any, message: string, status = 400) => {
    return NextResponse.json<ApiErrorResponse>({ error, message }, { status });
};
