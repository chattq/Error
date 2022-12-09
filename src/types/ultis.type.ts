export interface ErrorResponse<Data> {
    message: string
    data?: Data
}
export interface SuccesResponse<Data> {
    message: string
    data: Data
}