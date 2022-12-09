import { SuccesResponse } from "./ultis.type"
import { User } from "./user.type"

export type AuthResponse = SuccesResponse<{
    access_token: string
    expires: string
    user: User
}>