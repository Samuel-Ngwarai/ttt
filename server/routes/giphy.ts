interface Images {
  original: {
    url: string;
  };
};

interface GifData {
  images: Images;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const config = useRuntimeConfig();

  const { data } = await $fetch<{ data: GifData[] }>(
      `https://api.giphy.com/v1/gifs/search?api_key=${config.giphyAPIKey}&q=${query.prompt}&limit=${config.giphyRequestLimit}&rating=${query.rating}`
    );
  return data;
});
