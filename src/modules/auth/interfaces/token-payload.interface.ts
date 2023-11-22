export interface TokenPayload {
    userId: number;
    role: string;
    isSecondFactorAuthenticated?: boolean;
    iat?: number;
    exp?: number;
}

export default TokenPayload;
