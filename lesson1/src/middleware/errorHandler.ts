import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error(err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            return res.status(409).json({
                error: "Unique constraint failed",
                meta: err.meta,
            });
        }

        if (err.code === "P2025") {
            return res.status(404).json({
                error: "Record not found",
                meta: err.meta,
            });
        }
    }


    if (err instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({
            error: "Validation error",
            meta: err.message,
        });
    }

    return res.status(500).json({
        error: "Internal server error",
        meta: err.message || "Unknown error",
    });
}