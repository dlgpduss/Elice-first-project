import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import { validateEmail } from "./ValidateEmail";
import * as Api from "../../api";
import { DispatchContext } from "../../App";
import { setPageColor } from "./SetPageColor";
import "./caterpillar.css";

function LoginForm() {
  setPageColor();
  const navigate = useNavigate();
  const dispatch = useContext(DispatchContext);
  const completionWord = "Port Planet";

  //useState로 email 상태를 생성함.
  const [email, setEmail] = useState("");
  //useState로 password 상태를 생성함.
  const [password, setPassword] = useState("");
  //const [isValid, setIsValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [typingTitle, setTypingTitle] = useState("");
  const [count, setCount] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (count >= completionWord.length) {
        clearInterval(typingInterval);

        setTimeout(() => {
          setTypingTitle(completionWord);
          setIsTypingComplete(true);
        }, 500);
      } else {
        setTypingTitle((prevTitleValue) => {
          const result = prevTitleValue
            ? prevTitleValue + completionWord[count]
            : completionWord[0];
          setCount(count + 1);
          return result;
        });
      }
    }, 70);

    return () => {
      clearInterval(typingInterval);
    };
  });

  const checkValidity = (email, password) => {
    const emailIsValid = validateEmail(email);
    setIsEmailValid(emailIsValid);

    const passwordIsValid = password.length >= 8;
    setIsPasswordValid(passwordIsValid);

    //setIsValid(isEmailValid && isPasswordValid);
  };

  const isFormValid = isEmailValid && isPasswordValid;

  useEffect(() => {
    checkValidity(email, password);
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // "user/login" 엔드포인트로 post요청함.
      const res = await Api.post("user/login", {
        email,
        password,
      });
      // 유저 정보는 response의 data임.
      const user = res.data;
      // JWT 토큰은 유저 정보의 token임.
      const jwtToken = user.token;
      // sessionStorage에 "userToken"이라는 키로 JWT 토큰을 저장함.
      sessionStorage.setItem("userToken", jwtToken);
      // dispatch 함수를 이용해 로그인 성공 상태로 만듦.
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: user,
      });
      alert("로그인 성공! \nPort Planet에 오신 것을 환영합니다.");
      // 기본 페이지로 이동함.
      navigate("/", { replace: true });
    } catch (err) {
      alert("로그인에 실패하였습니다.\n", err);
    }
  };

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center "
      style={{ padding: "7rem", maxHeight: "100vh"}}
    >
      <div className="caterpillar"></div>
      <div className="login-form">
        <Container
          style={{
            maxWidth: "550px",
            width: "100%",
            padding: "85px",
            border: "1.5px solid rgba(128, 128, 128, 0.5)",
            borderRadius: "10px",
            backgroundColor: "#F5F5F5",
          }}
        >
          <Row className="text-center">
            <h1 style={{ display: "grid", fontSize: "2rem" }}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/768/768464.png?w=740&t=st=1683117616~exp=1683118216~hmac=1efef7fc266c902b5fedae87213037a482f8adfed985e8114442c3854884bb8e"
                alt="우주아이콘"
                width="30"
                height="30"
              ></img>
              {isTypingComplete ? completionWord : typingTitle}
            </h1>
          </Row>
          {isTypingComplete && (
            <Row className="mt-5" style={{ minWidth: "13rem" }}>
              <Col lg={12}>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="loginEmail">
                    <Form.Label>이메일 주소</Form.Label>
                    <Form.Control
                      type="email"
                      autoComplete="on"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {!isEmailValid && (
                      <Form.Text className="text">
                        이메일 형식이 올바르지 않습니다.
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group controlId="loginPassword" className="mt-3">
                    <Form.Label>비밀번호</Form.Label>
                    <Form.Control
                      type="password"
                      autoComplete="on"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {!isPasswordValid && (
                      <Form.Text className="text">
                        비밀번호는 8글자 이상입니다.
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group as={Row} className="mt-3 text-center">
                    <Col sm={{ span: 20 }}>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={!isFormValid}
                      >
                        로그인
                      </Button>
                    </Col>
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          )}
        </Container>
        {isTypingComplete && (
          <Container
            style={{
              marginTop: "10px",
              maxWidth: "550px",
              width: "100%",
              padding: "1rem",
              border: "1.5px solid rgba(128, 128, 128, 0.5)",
              borderRadius: "10px",
              backgroundColor: "#F5F5F5",
            }}
          >
            <Form.Group as={Row} className="mt-3 text-center">
              <Col sm={{ span: 20 }}>
                <Form.Text>아직도 계정이 없으신가요? </Form.Text>
                <Button variant="#F5F5F5" onClick={() => navigate("/register")}>
                  회원가입
                </Button>
              </Col>
            </Form.Group>
          </Container>
        )}
      </div>
    </Container>
  );
}

export default LoginForm;
