const Product = require("./../../models/product.model");
const Category = require("./../../models/category.model");
const Occasion = require("./../../models/occasion.model");
const Shop = require("./../../models/shop.model");
const Blog = require("./../../models/blog.model");
const Faq = require("./../../models/faq.model");
const Career = require("./../../models/career.model");
const Testimonial = require("./../../models/testimonial.model");
const AboutUs = require("./../../models/AboutUs");
const HomeInfo = require("./../../models/HomeInfo");
const PrivacyPolicy = require("./../../models/PrivacyPolicy");
const ShippingPolicy = require("./../../models/ShippingPolicy");
const ReturnPolicy = require("./../../models/ReturnPolicy");
const Coupon = require("./../../models/coupon.model");
const Video = require("./../../models/Video");
const Banner = require("./../../models/banner.model");


const globalSearch = async (req, res) => {
    try {

        const search = (req.query.search || "").trim();


        // Empty search
        if (!search) {
            return res.status(200).json({
                success: true,
                search: "",
                total: 0,
                results: []
            });
        }


        // Escape regex special characters
        const escapedSearch = search.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const regex = new RegExp(escapedSearch, "i");


        const results = [];


        // =====================================================
        // PRODUCTS
        // =====================================================

        const products = await Product.find({
            isActive: true,
            $or: [
                { name: regex },
                { description: regex },
                { shortDescription: regex },
                { sku: regex },
                { tags: regex }
            ]
        })
            .select("name slug description shortDescription images price discountPrice")
            .limit(10)
            .lean();


        products.forEach((product) => {

            results.push({
                type: "product",
                title: product.name,
                description: product.shortDescription || product.description || "",
                slug: product.slug,
                image: product.images?.[0] || null,
                price: product.discountPrice || product.price || null,
                url: `/product/${product.slug}`
            });

        });


        // =====================================================
        // CATEGORIES
        // =====================================================

        const categories = await Category.find({
            isActive: true,
            $or: [
                { name: regex },
                { description: regex }
            ]
        })
            .select("name slug description image")
            .limit(10)
            .lean();


        categories.forEach((category) => {

            results.push({
                type: "category",
                title: category.name,
                description: category.description || "",
                slug: category.slug,
                image: category.image || null,
                url: `/categories/${category.slug}`
            });

        });


        // =====================================================
        // OCCASIONS
        // =====================================================

        const occasions = await Occasion.find({
            isActive: true,
            $or: [
                { name: regex },
                { description: regex }
            ]
        })
            .select("name slug description image")
            .limit(10)
            .lean();


        occasions.forEach((occasion) => {

            results.push({
                type: "occasion",
                title: occasion.name,
                description: occasion.description || "",
                slug: occasion.slug,
                image: occasion.image || null,
                url: `/occasion/${occasion.slug}`
            });

        });


        // =====================================================
        // SHOPS
        // =====================================================

        const shops = await Shop.find({
            isActive: true,
            $or: [
                { shopName: regex },
                { location: regex },
                { description: regex },
                { address: regex }
            ]
        })
            .select("shopName location description address images")
            .limit(10)
            .lean();


        shops.forEach((shop) => {

            results.push({
                type: "shop",
                title: shop.shopName,
                description: shop.description || shop.location || "",
                image: shop.images?.[0] || null,
                url: `/shops/${encodeURIComponent(shop.shopName)}`
            });

        });


        // =====================================================
        // BLOGS
        // =====================================================

        const blogs = await Blog.find({
            isPublished: true,
            $or: [
                { title: regex },
                { content: regex },
                { excerpt: regex },
                { author: regex },
                { tags: regex }
            ]
        })
            .select("title slug excerpt coverImage author")
            .limit(10)
            .lean();


        blogs.forEach((blog) => {

            results.push({
                type: "blog",
                title: blog.title,
                description: blog.excerpt || "",
                slug: blog.slug,
                image: blog.coverImage || null,
                url: `/blogs/${blog.slug}`
            });

        });


        // =====================================================
        // FAQs
        // =====================================================

        const faqs = await Faq.find({
            isActive: true,
            $or: [
                { question: regex },
                { answer: regex }
            ]
        })
            .select("question answer")
            .limit(10)
            .lean();


        faqs.forEach((faq) => {

            results.push({
                type: "faq",
                title: faq.question,
                description: faq.answer || "",
                url: `/faqs`
            });

        });


        // =====================================================
        // CAREERS
        // =====================================================

        const careers = await Career.find({
            isActive: true,
            $or: [
                { title: regex },
                { description: regex },
                { workMode: regex },
                { employmentType: regex }
            ]
        })
            .select("title description workMode employmentType")
            .limit(10)
            .lean();


        careers.forEach((career) => {

            results.push({
                type: "career",
                title: career.title,
                description: career.description || "",
                url: `/careers`
            });

        });


        // =====================================================
        // TESTIMONIALS
        // =====================================================

        const testimonials = await Testimonial.find({
            isActive: true,
            $or: [
                { name: regex },
                { designation: regex },
                { message: regex }
            ]
        })
            .select("name designation message image rating")
            .limit(10)
            .lean();


        testimonials.forEach((testimonial) => {

            results.push({
                type: "testimonial",
                title: testimonial.name,
                description: testimonial.message || "",
                image: testimonial.image || null,
                url: `/testimonials`
            });

        });


        // =====================================================
        // VIDEOS
        // =====================================================

        const videos = await Video.find({
            isActive: true,
            $or: [
                { title: regex },
                { creatorName: regex }
            ]
        })
            .select("title creatorName creatorImage video")
            .limit(10)
            .lean();


        videos.forEach((video) => {

            results.push({
                type: "video",
                title: video.title || video.creatorName,
                description: video.creatorName || "",
                image: video.creatorImage || null,
                url: `/videos`
            });

        });


        // =====================================================
        // BANNERS
        // =====================================================

        const banners = await Banner.find({
            isActive: true,
            $or: [
                { title: regex },
                { subtitle: regex },
                { position: regex }
            ]
        })
            .select("title subtitle image link position")
            .limit(10)
            .lean();


        banners.forEach((banner) => {

            results.push({
                type: "banner",
                title: banner.title,
                description: banner.subtitle || "",
                image: banner.image || null,
                url: banner.link || "/"
            });

        });


        // =====================================================
        // ABOUT US
        // =====================================================

        const about = await AboutUs.findOne({
            $or: [
                { introDescription: regex },
                { brandHeading: regex },
                { brandSubHeading: regex },
                { brandDescription: regex },
                { studioHeading: regex },
                { studioSubHeading: regex },
                { studioDescription: regex },
                { journeyHeading: regex }
            ]
        })
            .select(
                "introDescription brandHeading brandSubHeading brandDescription studioHeading studioSubHeading studioDescription journeyHeading"
            )
            .lean();


        if (about) {

            results.push({
                type: "about",
                title: "About Us",
                description:
                    about.brandDescription ||
                    about.introDescription ||
                    about.studioDescription ||
                    "",
                url: "/about-us"
            });

        }


        // =====================================================
        // HOME INFO
        // =====================================================

        const homeInfo = await HomeInfo.findOne({
            "infos": {
                $elemMatch: {
                    $or: [
                        { title: regex },
                        { value: regex }
                    ]
                }
            }
        })
            .select("infos")
            .lean();


        if (homeInfo) {

            const matchedInfo = homeInfo.infos?.find(
                (info) =>
                    regex.test(info.title || "") ||
                    regex.test(info.value || "")
            );


            if (matchedInfo) {

                results.push({
                    type: "home-info",
                    title: matchedInfo.title,
                    description: matchedInfo.value,
                    url: "/"
                });

            }

        }


        // =====================================================
        // PRIVACY POLICY
        // =====================================================

        const privacy = await PrivacyPolicy.findOne({
            content: regex
        })
            .select("content")
            .lean();


        if (privacy) {

            results.push({
                type: "privacy-policy",
                title: "Privacy Policy",
                description: privacy.content,
                url: "/privacy-policy"
            });

        }


        // =====================================================
        // SHIPPING POLICY
        // =====================================================

        const shipping = await ShippingPolicy.findOne({
            content: regex
        })
            .select("content")
            .lean();


        if (shipping) {

            results.push({
                type: "shipping-policy",
                title: "Shipping Policy",
                description: shipping.content,
                url: "/shipping-policy"
            });

        }


        // =====================================================
        // RETURN POLICY
        // =====================================================

        const returnPolicy = await ReturnPolicy.findOne({
            content: regex
        })
            .select("content")
            .lean();


        if (returnPolicy) {

            results.push({
                type: "return-policy",
                title: "Return Policy",
                description: returnPolicy.content,
                url: "/return-policy"
            });

        }


        // =====================================================
        // COUPONS
        // =====================================================

        const coupons = await Coupon.find({
            isActive: true,
            expiryDate: { $gte: new Date() },
            $or: [
                { code: regex }
            ]
        })
            .select("code discountType discountValue minOrderAmount expiryDate")
            .limit(10)
            .lean();


        coupons.forEach((coupon) => {

            results.push({
                type: "coupon",
                title: coupon.code,
                description:
                    `${coupon.discountType === "percentage"
                        ? coupon.discountValue + "% off"
                        : "₹" + coupon.discountValue + " off"}`,
                url: "/"
            });

        });


        // =====================================================
        // FINAL RESPONSE
        // =====================================================

        return res.status(200).json({
            success: true,
            search,
            total: results.length,
            results
        });


    } catch (error) {

        console.error("Global Search Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to perform global search",
            error: error.message
        });

    }
};


module.exports = {
    globalSearch
};