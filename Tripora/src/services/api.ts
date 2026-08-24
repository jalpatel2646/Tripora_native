export const API_BASE_URL = "http://192.168.1.94:5000";

export const handleApiResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`);
  }
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || data.error || 'Server error occurred');
  }
  
  return data;
};
