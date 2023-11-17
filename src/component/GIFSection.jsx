import { Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { avatars } from "../appwrite config/appwriteConfig";
import React from "react";

const GIFSection = () => {
  const gf = new GiphyFetch("dIg5yBQqlZKoP4hBUvJml2UflFbUJquy");
  // const fetchGifs = (number) => gf.trending({ number, limit: 10 })
  const gifs = async () =>
    await await gf.search("wwe", { limit: 10 }).then(
      function (response) {
        console.log(response.data);
      },
      function (error) {
        console.log(error);
      }
    );

    const showGif = () => {
      console.log(avatars.getImage('https://giphy.com/gifs/wwe-wrestling-26n6Mr1bkvZNAJup2').href)
    }
    React.useEffect(() => {showGif()}, [])
  return <Grid width={800} columns={3} fetchGifs={gifs} />;
};

export default GIFSection;
