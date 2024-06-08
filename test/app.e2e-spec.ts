import { Test } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common"
import { NestApplication, Reflector } from "@nestjs/core"
import { DatabaseService } from "../src/database/database.service"
import { ConfigService } from "@nestjs/config"

import * as pactum from "pactum"
import { SignInDto, SignUpDto } from "../src/auth/dto/auth.dto"
import * as cookieParser from 'cookie-parser';
import { EditUserDto } from "src/user/dto/editUser.dto"

describe("App e2e", () => {
  let app: NestApplication

  const configService = new ConfigService()
  const PORT = configService.get<number>("PORT")

  pactum.handler.addCaptureHandler('accessToken', (ctx) => {
    return ctx.res.headers["set-cookie"][0];
  });

  pactum.handler.addCaptureHandler('refreshToken', (ctx) => {
    return ctx.res.headers["set-cookie"][1];
  });

  beforeAll(async () => {
    const moduleMain = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleMain.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true
    }))

    app.useGlobalInterceptors(new ClassSerializerInterceptor(
      app.get(Reflector)
    ))

    app.use(cookieParser())

    await app.init()
    await app.listen(PORT)

    const databaseService = app.get(DatabaseService)
    await databaseService.cleanDb()


    pactum.request.setBaseUrl(`http://localhost:${PORT}`)
  })

  afterAll(() => {
    app.close()
  })

  describe("Auth", () => {

    describe("SignUp", () => {
      const dto: SignUpDto = {
        username: "hassan",
        password: "123",
        firstname: "Hassan",
        lastname: "Ammar",
        birthdate: "2002-10-10"
      }

      it("Bad Request if no body", () => {
        return pactum.spec()
          .post("/auth/signUp")
          .expectStatus(400)

      })

      it("Bad Request if not username", () => {
        var dtoIn = { ...dto }
        delete dtoIn.username

        return pactum.spec()
          .post("/auth/signUp")
          .withBody(dtoIn)
          .expectStatus(400)

      })

      it("Bad Request if not password", () => {
        var dtoIn = { ...dto }
        delete dtoIn.password

        return pactum.spec()
          .post("/auth/signUp")
          .withBody(dtoIn)
          .expectStatus(400)

      })

      it("Bad Request if not password & username", () => {
        var dtoIn = { ...dto }
        delete dtoIn.password
        delete dtoIn.username

        return pactum.spec()
          .post("/auth/signUp")
          .withBody(dtoIn)
          .expectStatus(400)

      })

      it("Should SignUp", () => {
        return pactum.spec()
          .post("/auth/signUp")
          .withBody(dto)
          .expectStatus(201)

      })

      it("Bad Request if same username", () => {
        return pactum.spec()
          .post("/auth/signUp")
          .withBody(dto)
          .expectStatus(400)

      })

      it("Should Accept no bithdte", () => {
        var dtoIn = { ...dto }

        dtoIn.username += "1"
        delete dtoIn.birthdate

        return pactum.spec()
          .post("/auth/signUp")
          .withBody(dtoIn)
          .expectStatus(201)
      })

    })

    describe("SignIn", () => {
      const dto: SignInDto = {
        username: "hassan",
        password: "123",
      }

      it("Bad Request if no body", () => {
        return pactum.spec()
          .get("/auth/signIn")
          .expectStatus(400)

      })

      it("Bad Request if not username", () => {
        var dtoIn = { ...dto }
        delete dtoIn.username

        return pactum.spec()
          .get("/auth/signIn")
          .withBody(dtoIn)
          .expectStatus(400)

      })

      it("Bad Request if not password", () => {
        var dtoIn = { ...dto }
        delete dtoIn.password

        return pactum.spec()
          .get("/auth/signIn")
          .withBody(dtoIn)
          .expectStatus(400)

      })

      it("Should SignIn", () => {
        return pactum.spec()
          .get("/auth/signIn")
          .withBody(dto)
          .expectStatus(200)
          .stores("user_accessToken", "#accessToken")
          .stores("user_refreshToken", "#refreshToken")
      })

      it("Not Found if wrong password", () => {
        var dtoIn = { ...dto }
        dtoIn.password += "3"

        return pactum.spec()
          .get("/auth/signIn")
          .withBody(dtoIn)
          .expectStatus(404)

      })

      it("Not Found if user not found", () => {
        var dtoIn = { ...dto }
        dtoIn.username += "pojp"

        return pactum.spec()
          .get("/auth/signIn")
          .withBody(dtoIn)
          .expectStatus(404)
      })
    })

    describe("Refresh", () => {
      it("should refresh", async () => {
        return pactum.spec()
          .get("/auth/refresh")
          .withCookies("$S{user_refreshToken}")
          .expectStatus(200)
          .stores("user_accessToken", "#accessToken")
          .stores("user_refreshToken", "#refreshToken")
        })

      it("UnAuthorized if no access token", () => {
        return pactum.spec()
          .get("/auth/refresh")
          .expectStatus(401)

      })
    })

    describe("LogOut", () => {
      it("Logout successfully", () => {
        return pactum.spec()
          .get("/auth/logout")
          .withCookies('$S{user_accessToken}')
          .expectStatus(200)
      })

      it("UnAuthorized after logout", () => {
        return pactum.spec()
          .get("/auth/refresh")
          .withCookies("$S{user_accessToken}")
          .expectStatus(401)
      })

      const dto: SignInDto = {
        username: "hassan",
        password: "123",
      }

      it("Should SignIn", () => {
        return pactum.spec()
          .get("/auth/signIn")
          .withBody(dto)
          .expectStatus(200)
          .stores("user_accessToken", "#accessToken")
          .stores("user_refreshToken", "#refreshToken")
      })

      it("Should Refresh after sign in", () => {
        return pactum.spec()
          .get("/auth/refresh")
          .withCookies("$S{user_refreshToken}")
          .expectStatus(200)
      })

    })
  })

})

describe("User", () => {
  describe("Get Profile", () => {
    it("Should get user profile", () => {
      return pactum.spec()
        .get("/user/profile")
        .expectStatus(200)
        .withCookies("$S{user_accessToken}")
    })

    it("UnAuthorized if wrong token", () => {
      return pactum.spec()
        .get("/user/profile")
        .expectStatus(401)
        .withCookies("$S{user_refreshToken}")

    })
  })

  describe("Edit Profile", () => {
    const dto: EditUserDto = {
      firstname: "Has",
      lastname: "Amm",
      birthdate: "2002-10-08"
    }

    it("should Edit Profile", () => {
      return pactum.spec()
        .patch("/user/editProfile")
        .withBody(dto)
        .expectStatus(200)
        .withCookies("$S{user_accessToken}")
    })

    it("should Edit Profile", () => {
      return pactum.spec()
        .patch("/user/editProfile")
        .withBody(dto)
        .expectStatus(200)
        .withCookies("$S{user_accessToken}")
        .expectBodyContains(dto.firstname)
        .expectBodyContains(dto.lastname)
        .stores("userId", "id")
    })
  })

  describe("Test User Id Decorator", () => {
    it("should return user id", () => {
      return pactum.spec()
        .get("/user/testUserId")
        .expectStatus(200)
        .withCookies("$S{user_accessToken}")
        .expectBodyContains("$S{userId}")
    })
  })
}) 
