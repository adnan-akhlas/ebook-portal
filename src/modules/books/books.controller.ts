import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import httpStatus from "http-status-codes";
import fs from "node:fs";
import path from "node:path";
import cloudinary from "../../config/cloudinary.config";
import { BookModel } from "./books.model";

export async function addBook(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { title, genre } = req.body;
    const userId = req.user.sub as string;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverImageFile = files?.coverImage?.[0];

    if (!coverImageFile) {
      return next(
        createHttpError(httpStatus.BAD_REQUEST, "Cover image is required."),
      );
    }

    const coverImageFileName = coverImageFile.filename;
    const coverImageFilePath = path.join(
      __dirname,
      "../../../public/data/uploads",
      coverImageFileName,
    );

    const imageFileUploadResult = await cloudinary.uploader.upload(
      coverImageFilePath,
      {
        filename_override: coverImageFileName,
        folder: "book_covers",
        format: "webp",
        overwrite: true,
        unique_filename: true,
        use_filename: true,
        transformation: [{ quality: "auto" }],
      },
    );

    const bookFile = files?.file?.[0];

    if (!bookFile) {
      return next(
        createHttpError(httpStatus.BAD_REQUEST, "Book pdf is required"),
      );
    }

    const bookFileName = bookFile.filename;
    const bookFilePath = path.join(
      __dirname,
      "../../../public/data/uploads",
      bookFileName,
    );

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        filename_override: bookFileName,
        resource_type: "raw",
        format: "pdf",
        use_filename: true,
        unique_filename: true,
        overwrite: true,
        folder: "book_pdfs",
      },
    );

    await fs.promises.unlink(bookFilePath);
    await fs.promises.unlink(coverImageFilePath);

    const newBook = await BookModel.create({
      title,
      genre,
      coverImage: imageFileUploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
      author: userId,
    });

    res
      .status(httpStatus.CREATED)
      .json({ message: "Book added successfully.", bookId: newBook.id });
  } catch (error: unknown) {
    console.log(error);
    next(error);
  }
}
