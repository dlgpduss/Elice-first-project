import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Card, Row, Button, Col } from "react-bootstrap";
import axios from "axios";
import * as Api from "../../api";

import LikeButton from "./LikeButton";
  
function UserCard({ user, setIsEditing, isEditable, isNetwork }) {
  const isUser = !!user;
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("http://placekitten.com/200/200");
  const handleDelete = async () => {
    await Api.delete("users", user.id).then(() => {
      alert("회원탈퇴 성공.");
    });
  };
  useEffect(() => {
    if (user?.profileImage?.path) {
      axios
        .get(`http://${window.location.hostname}:5001/${user?.profileImage?.path}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
          },
          responseType: "blob", // blob 데이터로 받기 위해 responseType 설정
        })
        .then((res) => {
          const imageUrl = URL.createObjectURL(res.data); // Blob 데이터를 가리키는 URL 생성
          setImageUrl(imageUrl);
        })
        .catch((error) => console.error(error));
    }
  }, [user?.profileImage?.path]);
  return (
    <Card className="mb-2 ms-3 mr-5" style={{ width: "15rem" }}>
      <Card.Body>
        <Row className="justify-content-md-center">
          <Card.Img
            style={{ width: "15rem", height: "12rem"}}
            className="mx-auto d-block mb-3"
            src={imageUrl}
            alt="랜덤 고양이 사진 (http://placekitten.com API 사용)"
          />
        </Row>
        {/* <Card.Body className="text-center"> */}
          <Card.Title>{user?.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted small">{user?.email}</Card.Subtitle>
          <Card.Text style={{ fontSize: "14px" }}>{user?.description}</Card.Text>
          <br></br>
          <Card.Text>{isUser && <LikeButton user={user} />}</Card.Text>
        {/* </Card.Body> */}
        {isEditable && (
          <Col>
            <Row className="mt-3 text-center text-info justify-content-center">
              <Col sm={{ span: 20 }}>
              <Button
                variant="outline-info"
                size="sm"
                style={{ fontSize: "0.5rem", border: "none", cursor: "pointer"}}
                onClick={() => setIsEditing(true)}
              >
                ✏️EDIT
              </Button>
              </Col>
            </Row>
            <Button
                variant="outline-danger"
                size="sm"
                onClick={handleDelete}>
                회원탈퇴
              </Button>
          </Col>
        )}

        {isNetwork && (
          <Card.Link
            className="mt-3"
            href="#"
            onClick={() => {
              navigate(`/users/${user.id}`);
            }}
          >
            포트폴리오
          </Card.Link>
        )}
      </Card.Body>
    </Card>
  );
}

export default UserCard;
