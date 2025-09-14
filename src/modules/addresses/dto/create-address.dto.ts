export class CreateAddressDto {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault?: boolean;
}
