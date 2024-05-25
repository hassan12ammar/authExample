import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const getUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const resuest: Request = context
        .switchToHttp()
        .getRequest()
    return resuest.user
})
