import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { UserInfo } from "../dto/auth.dto";

export const getUser = createParamDecorator((data: string | undefined,
    context: ExecutionContext) => {
    const resuest: Request = context
        .switchToHttp()
        .getRequest()

    const user = new UserInfo(resuest.user)

    if (data) {
        return user[data]
    }

    return user
})
