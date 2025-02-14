import { useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { getNewsDetails } from "../api/adapters";
import { getNewsDetailsEndpoint } from "../api/endpoints";
import { useFetch } from "../utils/hooks/useFetch";
import { Container, Row, Col, Button } from "react-bootstrap";
import styles from "./NewsDetails.module.css";
import { getFormattedDate } from "../utils/date";
import { addToFavorites } from "../store/Favorites/actions";
import { useContext, useEffect, useState } from "react";
import { FavoritesContext } from "../store/Favorites/context";
import { Notification } from "../components/Notification";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export function NewsDetails() {
  const params = useParams();
  const newsId = params.newsId + "/" + params["*"];

  const { favoritesState, favoritesDispatch } = useContext(FavoritesContext);

  const newsDetailsEndpoint = getNewsDetailsEndpoint(newsId);

  const newsDetails = useFetch(newsDetailsEndpoint);

  const adaptedNewsDetails = getNewsDetails(newsDetails);

  const [_, setLocalStorageState] = useLocalStorage(
    "favorites",
    favoritesState
  );

  useEffect(() => {
    setLocalStorageState(favoritesState);
  }, [favoritesState, setLocalStorageState]);

  const { title, description, image, date, author, content, thumbnail } =
    adaptedNewsDetails;

  const [list, setList] = useState([]);
  const handleAddToFavorites = () => {
    const toastProperties = {
      id: list.length + 1,
      description: "Added to favorites",
      backgroundColor: "#198754",
    };
    setList([...list, toastProperties]);

    const newsItem = {
      id: newsId,
      image: thumbnail,
      title,
      description,
      hasDeleteButton: true,
    };

    const actionResult = addToFavorites(newsItem);
    favoritesDispatch(actionResult);
  };

  return (
    <Layout>
      <Container className={`${styles.newsDetails} text-start my-5`}>
        <Row>
          <Col xs={12} lg={8} className="mx-auto">
            <h1 className="my-5">{title}</h1>
            <p className="fw-bold">{description}</p>
            <div dangerouslySetInnerHTML={{ __html: image }} className="mb-4" />
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="fw-bold">
                <p>{author}</p>
                <p>{getFormattedDate(date)}</p>
              </div>
              <Button variant="success" onClick={handleAddToFavorites}>
                Add to favorites
              </Button>
            </div>
            <Notification
              alertlist={list}
              position="buttom-right"
              setList={setList}
            />
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
