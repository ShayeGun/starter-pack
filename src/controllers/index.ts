import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catch-async";

export const testController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.json({
        data: "testing successful"
    });
});