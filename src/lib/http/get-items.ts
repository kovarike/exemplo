import axios from "axios";

type dataSchema = {
    name: string;
    id: string;
    completed: boolean;
}[]

export async function getItems(): Promise<dataSchema>{
    const response = await axios.get('/api/items');
    
    const data = await response.data;
    return data;
}