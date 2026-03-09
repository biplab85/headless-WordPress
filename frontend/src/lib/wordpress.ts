const API_URL = process.env.WORDPRESS_API_URL!;

interface FetchOptions {
  revalidate?: number | false;
  tags?: string[];
}

export async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { revalidate = 60, tags } = options;

  const res = await fetch(`${API_URL}${endpoint}`, {
    next: { revalidate, tags },
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`WordPress API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(
    `${API_URL.replace("/wp-json", "")}/graphql`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    throw new Error(`GraphQL error: ${res.status}`);
  }

  const json = await res.json();
  return json.data;
}
