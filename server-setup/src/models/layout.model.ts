import mongoose, { Document, Model, Schema } from "mongoose";

interface FaqItem extends Document {
  question: string;
  answer: string;
}

interface Category extends Document {
  title: string;
}

interface BannerImage extends Document {
  public_id: string;
  url: string;
}

interface Layout extends Document {
  type: string;
  faq: FaqItem[];
  categories: Category[];
  banner: {
    image: BannerImage;
    title: string;
    subTitle: string;
  };
}

const faqSchema: Schema<FaqItem> = new Schema(
  {
    question: {
      type: String,
    },
    answer: {
      type: String,
    },
  },
  { timestamps: true }
);

const categoriesSChema: Schema<Category> = new Schema({
  title: {
    type: String,
  },
});

const bannerImageSchema: Schema<BannerImage> = new Schema({
  public_id: {
    type: String,
  },
  url: {
    type: String,
  },
});

const layoutSchema: Schema<Layout> = new Schema({
  type: {
    type: String,
  },
  faq: [faqSchema],
  categories: [categoriesSChema],
  banner: {
    image: bannerImageSchema,
    title: {
      type: String,
    },
    subTitle: {
      type: String,
    },
  },
});

const layoutModel: Model<Layout> = mongoose.model("Layout", layoutSchema);

export default layoutModel;
