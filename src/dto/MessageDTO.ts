export interface MessageDTO {
    type: string;
    content: string;
    from: string;
    to: string;
    you_sent: boolean;
    timestamp: string;
    full_name: string;
    isOptimistic?: boolean;
}