import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";

//Components
import Thumbnail from "../Posts/Thumbnail";
import { MasonryThumbnail } from "../Posts/Thumbnail";

//Static files
import "../../public/css/Grid/grid.css";

function NoPostsMedia({ isLoggedUser }) {
  return (
    <div className="w-100 grid-pos-1-2">
      {/* Content when No post */}
      {isLoggedUser ? (
        <div className="no-post flex-column">
          <span className="coreSpriteProfileCamera"></span>
          <h2>Sube una imagen</h2>
          <p className="mp-0">Puedes seleccionar una secuencia</p>
          <Link
            to="/p/upload"
            className="bt-upload mp-0 w-100 flex-row decoration-none"
          >
            <button className="w-50">Subir</button>
          </Link>
        </div>
      ) : (
        <div className="no-post flex-column">
          <h2>No hay publicaciones</h2>
          <p className="mp-0">El usuario no tiene publicaciones aún.</p>
        </div>
      )}
    </div>
  );
}

function NoSavedMedia() {
  return (
    <div className="w-100 grid-pos-1-2">
      {/* Content when No post */}
      <div className="no-post flex-column">
        <span className="coreSpriteSaveNull"></span>
        <h2 className="no-post-h2">Guardar</h2>
        <p className="mp-0 tx-center no-post-p">
          Guarda las fotos y los vídeos que quieras volver a ver. Nadie recibirá
          ninguna notificación y solo tú podrás ver lo que has guardado.
        </p>
      </div>
    </div>
  );
}

function Grid({ posts, isLoggedUser, type }) {
  const [section, setSection] = useState(
    <NoPostsMedia isLoggedUser={isLoggedUser} />
  );

  /**
   * Loads the grid with the user's posts or the user's saved posts,
   * depending on the nav option selected.
   */
  const loadType = () => {
    switch (type) {
      case "posts":
        setSection(<NoPostsMedia isLoggedUser={isLoggedUser} />);
        break;

      case "saved":
        setSection(<NoSavedMedia />);
        break;
    }
  };

  useEffect(() => {
    loadType();
  }, [type]);

  return (
    <div className="grid" id="modalPost">
      <div className="grid-posts">
        {posts.length > 0 ? (
          posts.map((p) => (
            <Thumbnail
              key={p._id}
              thumb={p.thumbnail}
              thumbAlt={p.text}
              postId={p._id}
              filter={p.imgFilter}
            />
          ))
        ) : (
          <>{section}</>
        )}
      </div>
    </div>
  );
}

export function MasonryGrid({ posts }) {
  return (
    <div className="masonry-grid">
      <div className="grid-posts-masonry">
        {posts.length > 0 ? (
          posts.map((p) => (
            <MasonryThumbnail
              key={p._id}
              thumb={p.thumbnail}
              thumbAlt={p.text}
              postId={p._id}
              filter={p.imgFilter}
            />
          ))
        ) : (
          <NoPostsMedia />
        )}
      </div>
    </div>
  );
}
export default withRouter(Grid);
