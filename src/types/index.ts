export interface User {
    name: string;
    location: string;
}
export interface Review {
    user: User;
    rating: number;
    title: string;
    description: string
}

export interface Hotel {
    id: number;
    name: string;
    rating: number;
    stars: number;
    address: string;
    photo: string;
    price: number;
    description: string;
    reviews?: Array<Review>
}