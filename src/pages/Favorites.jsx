import { useContext } from "react";
import { Container } from "react-bootstrap";
import { Layout } from "../components/Layout";
import { NewsCardList } from "../components/NewsCardList";
import { FavoritesContext } from "../store/Favorites/context";

export function Favorites() {
  const { favoritesState } = useContext(FavoritesContext);

  return (
    <Layout>
      <Container className="my-5">
        <h1 className="my-5">Favorites news</h1>
        {favoritesState.news.length === 0 ? (
          <p>At the moment you have not any favorite news</p>
        ) : (
          <NewsCardList newsList={favoritesState.news} />
        )}
      </Container>
    </Layout>
  );
}
