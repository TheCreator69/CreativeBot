export interface CreativeCommandAttributes {
    name: string,
    description: string,
    syntax: string,
    min_args: number,
    admin_only: boolean,
    category?: string,
}
