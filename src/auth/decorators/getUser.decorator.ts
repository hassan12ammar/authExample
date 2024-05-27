import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "@prisma/client";
import { Request } from "express";

export const getUser = createParamDecorator((data: string | undefined,
    context: ExecutionContext) => {
    const resuest: Request = context
        .switchToHttp()
        .getRequest()

    const user = resuest.user as User
    
    if (data) {
        return user[data]
    }

    delete user.password
    return user
})
