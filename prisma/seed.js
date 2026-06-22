const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv").config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.review.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();

  const collegesData = [
    {
      name: "Indian Institute of Technology Bombay",
      city: "Mumbai", state: "Maharashtra", fees: 220000, rating: 4.8,
      type: "Government", examAccepted: ["JEE Advanced"], cutoffRank: 500,
      overview: "IIT Bombay is one of India's premier engineering institutions, known for its research output and industry connections.",
      placementAvg: 1800000, placementHighest: 12000000,
      courses: [{ name: "Computer Science Engineering", duration: "4 years", fees: 220000 }],
      reviews: [{ rating: 5, author: "Aarav S.", comment: "Incredible faculty and research opportunities." }],
    },
    {
      name: "Vellore Institute of Technology",
      city: "Vellore", state: "Tamil Nadu", fees: 198000, rating: 4.3,
      type: "Private", examAccepted: ["VITEEE"], cutoffRank: 15000,
      overview: "VIT is a leading private university known for its diverse student base and strong industry tie-ups.",
      placementAvg: 750000, placementHighest: 4100000,
      courses: [{ name: "Computer Science Engineering", duration: "4 years", fees: 198000 }],
      reviews: [{ rating: 4, author: "Rohan K.", comment: "Great campus life and decent placements." }],
    },
    {
      name: "Delhi Technological University",
      city: "Delhi", state: "Delhi", fees: 160000, rating: 4.5,
      type: "Government", examAccepted: ["JEE Main"], cutoffRank: 8000,
      overview: "DTU is a top government engineering college in Delhi with strong placement records.",
      placementAvg: 1100000, placementHighest: 5500000,
      courses: [{ name: "Computer Science Engineering", duration: "4 years", fees: 160000 }],
      reviews: [{ rating: 5, author: "Sanya T.", comment: "Excellent ROI for the fees." }],
    },
    {
      name: "Manipal Institute of Technology",
      city: "Manipal", state: "Karnataka", fees: 450000, rating: 4.1,
      type: "Private", examAccepted: ["MET"], cutoffRank: 25000,
      overview: "MIT Manipal offers a vibrant campus life with strong international exposure.",
      placementAvg: 690000, placementHighest: 3200000,
      courses: [{ name: "Computer Science Engineering", duration: "4 years", fees: 450000 }],
      reviews: [{ rating: 4, author: "Karan V.", comment: "Beautiful campus, fees are high though." }],
    },
    {
      name: "National Institute of Technology Trichy",
      city: "Tiruchirappalli", state: "Tamil Nadu", fees: 145000, rating: 4.4,
      type: "Government", examAccepted: ["JEE Main"], cutoffRank: 6000,
      overview: "NIT Trichy is consistently ranked among the top NITs in India.",
      placementAvg: 1200000, placementHighest: 4400000,
      courses: [{ name: "Computer Science Engineering", duration: "4 years", fees: 145000 }],
      reviews: [{ rating: 5, author: "Divya R.", comment: "Strong alumni network." }],
    },
    {
      name: "Birla Institute of Technology and Science, Pilani",
      city: "Pilani", state: "Rajasthan", fees: 480000, rating: 4.6,
      type: "Private", examAccepted: ["BITSAT"], cutoffRank: 12000,
      overview: "BITS Pilani is a top-tier private institute known for flexible curriculum and strong placements.",
      placementAvg: 1900000, placementHighest: 6500000,
      courses: [{ name: "Computer Science Engineering", duration: "4 years", fees: 480000 }],
      reviews: [{ rating: 5, author: "Ishaan P.", comment: "No-detention system and great peer group." }],
    },
    {
      name: "National Institute of Technology Surathkal",
      city: "Surathkal", state: "Karnataka", fees: 150000, rating: 4.3,
      type: "Government", examAccepted: ["JEE Main"], cutoffRank: 9500,
      overview: "NIT Surathkal is a top NIT known for its coastal campus and strong core engineering programs.",
      placementAvg: 1150000, placementHighest: 4800000,
      courses: [{ name: "Mechanical Engineering", duration: "4 years", fees: 150000 }],
      reviews: [{ rating: 4, author: "Meera N.", comment: "Beautiful campus by the beach." }],
    },
    {
      name: "SRM Institute of Science and Technology",
      city: "Chennai", state: "Tamil Nadu", fees: 225000, rating: 3.9,
      type: "Private", examAccepted: ["SRMJEEE"], cutoffRank: 30000,
      overview: "SRM is a large private university with diverse programs and modern campus infrastructure.",
      placementAvg: 580000, placementHighest: 2500000,
      courses: [{ name: "Computer Science Engineering", duration: "4 years", fees: 225000 }],
      reviews: [{ rating: 3, author: "Yash B.", comment: "Good infra, placements vary by branch." }],
    },
    {
      name: "Indian Institute of Technology Delhi",
      city: "Delhi", state: "Delhi", fees: 225000, rating: 4.9,
      type: "Government", examAccepted: ["JEE Advanced"], cutoffRank: 350,
      overview: "IIT Delhi is one of the top engineering institutes in India with excellent research facilities.",
      placementAvg: 2000000, placementHighest: 15000000,
      courses: [{ name: "Computer Science Engineering", duration: "4 years", fees: 225000 }],
      reviews: [{ rating: 5, author: "Tara J.", comment: "World-class faculty and resources." }],
    },
    {
      name: "Thapar Institute of Engineering and Technology",
      city: "Patiala", state: "Punjab", fees: 410000, rating: 4.0,
      type: "Private", examAccepted: ["JEE Main"], cutoffRank: 20000,
      overview: "Thapar is a well-regarded private engineering institute with good industry connections.",
      placementAvg: 820000, placementHighest: 4200000,
      courses: [{ name: "Computer Science Engineering", duration: "4 years", fees: 410000 }],
      reviews: [{ rating: 4, author: "Nikhil D.", comment: "Solid placements for CSE branch." }],
    },
    {
      name: "Jawaharlal Nehru Technological University Hyderabad",
      city: "Hyderabad", state: "Telangana", fees: 65000, rating: 4.0,
      type: "Government", examAccepted: ["EAMCET"], cutoffRank: 5000,
      overview: "JNTUH is a leading state technical university in Telangana with strong industry linkages.",
      placementAvg: 480000, placementHighest: 1800000,
      courses: [{ name: "Computer Science Engineering", duration: "4 years", fees: 65000 }],
      reviews: [{ rating: 4, author: "Sai K.", comment: "Affordable and decent placements for CSE." }],
    },
    {
      name: "Osmania University College of Engineering",
      city: "Hyderabad", state: "Telangana", fees: 58000, rating: 4.1,
      type: "Government", examAccepted: ["EAMCET"], cutoffRank: 4000,
      overview: "One of the oldest engineering colleges in South India with a strong academic legacy.",
      placementAvg: 510000, placementHighest: 2000000,
      courses: [{ name: "Electronics and Communication Engineering", duration: "4 years", fees: 58000 }],
      reviews: [{ rating: 4, author: "Lakshmi V.", comment: "Great legacy and faculty support." }],
    },
    {
      name: "CVR College of Engineering",
      city: "Hyderabad", state: "Telangana", fees: 95000, rating: 3.8,
      type: "Private", examAccepted: ["EAMCET"], cutoffRank: 18000,
      overview: "CVR is a private engineering college known for good infrastructure and consistent placements.",
      placementAvg: 420000, placementHighest: 1500000,
      courses: [{ name: "Computer Science Engineering", duration: "4 years", fees: 95000 }],
      reviews: [{ rating: 4, author: "Rahul M.", comment: "Good labs and supportive faculty." }],
    },
    {
      name: "VNR Vignana Jyothi Institute of Engineering and Technology",
      city: "Hyderabad", state: "Telangana", fees: 110000, rating: 4.2,
      type: "Private", examAccepted: ["EAMCET"], cutoffRank: 12000,
      overview: "VNRVJIET is a well-known autonomous college with strong placement records in Hyderabad.",
      placementAvg: 580000, placementHighest: 2800000,
      courses: [{ name: "Computer Science Engineering", duration: "4 years", fees: 110000 }],
      reviews: [{ rating: 4, author: "Ananya R.", comment: "Great placement cell and active clubs." }],
    },
    {
      name: "Andhra University College of Engineering",
      city: "Visakhapatnam", state: "Andhra Pradesh", fees: 60000, rating: 4.0,
      type: "Government", examAccepted: ["EAMCET"], cutoffRank: 6000,
      overview: "A historic government college in Visakhapatnam with strong core engineering programs.",
      placementAvg: 460000, placementHighest: 1700000,
      courses: [{ name: "Civil Engineering", duration: "4 years", fees: 60000 }],
      reviews: [{ rating: 4, author: "Kiran T.", comment: "Strong core branches and campus life." }],
    },
    {
      name: "JNTU College of Engineering, Kakinada",
      city: "Kakinada", state: "Andhra Pradesh", fees: 62000, rating: 4.1,
      type: "Government", examAccepted: ["EAMCET"], cutoffRank: 5500,
      overview: "JNTUK Kakinada is a respected government engineering college in coastal Andhra Pradesh.",
      placementAvg: 470000, placementHighest: 1900000,
      courses: [{ name: "Mechanical Engineering", duration: "4 years", fees: 62000 }],
      reviews: [{ rating: 4, author: "Bhavana S.", comment: "Solid academics and affordable fees." }],
    },
    {
      name: "Vignan's Foundation for Science, Technology and Research",
      city: "Guntur", state: "Andhra Pradesh", fees: 105000, rating: 3.9,
      type: "Private", examAccepted: ["EAMCET"], cutoffRank: 16000,
      overview: "Vignan is a deemed university with modern infrastructure and decent industry connections.",
      placementAvg: 440000, placementHighest: 1600000,
      courses: [{ name: "Computer Science Engineering", duration: "4 years", fees: 105000 }],
      reviews: [{ rating: 3, author: "Naveen P.", comment: "Good campus, placements vary by branch." }],
    },
    {
      name: "Gokaraju Rangaraju Institute of Engineering and Technology",
      city: "Hyderabad", state: "Telangana", fees: 98000, rating: 4.0,
      type: "Private", examAccepted: ["EAMCET"], cutoffRank: 14000,
      overview: "GRIET is a well-regarded autonomous private engineering college in Hyderabad.",
      placementAvg: 560000, placementHighest: 2400000,
      courses: [{ name: "Information Technology", duration: "4 years", fees: 98000 }],
      reviews: [{ rating: 4, author: "Pooja G.", comment: "Good placement support and active TPO cell." }],
    },
    {
      name: "Sreenidhi Institute of Science and Technology",
      city: "Hyderabad", state: "Telangana", fees: 100000, rating: 3.9,
      type: "Private", examAccepted: ["EAMCET"], cutoffRank: 15000,
      overview: "SNIST is known for its strong CSE department and consistent placement record.",
      placementAvg: 540000, placementHighest: 2200000,
      courses: [{ name: "Computer Science Engineering", duration: "4 years", fees: 100000 }],
      reviews: [{ rating: 4, author: "Arjun C.", comment: "Good for CSE, decent campus facilities." }],
    },
    {
      name: "Velagapudi Ramakrishna Siddhartha Engineering College",
      city: "Vijayawada", state: "Andhra Pradesh", fees: 85000, rating: 3.8,
      type: "Private", examAccepted: ["EAMCET"], cutoffRank: 17000,
      overview: "VRSEC is a well-established private engineering college in Vijayawada with strong local reputation.",
      placementAvg: 410000, placementHighest: 1400000,
      courses: [{ name: "Electronics and Communication Engineering", duration: "4 years", fees: 85000 }],
      reviews: [{ rating: 4, author: "Harini D.", comment: "Good faculty support and affordable fees." }],
    },
    {
      name: "Chaitanya Bharathi Institute of Technology",
      city: "Hyderabad", state: "Telangana", fees: 100000, rating: 4.3,
      type: "Private", examAccepted: ["EAMCET"], cutoffRank: 8000,
      overview: "CBIT is one of the most reputed autonomous engineering colleges in Hyderabad, known for academic excellence and placements.",
      placementAvg: 650000, placementHighest: 3500000,
      courses: [{ name: "Computer Science Engineering", duration: "4 years", fees: 100000 }],
      reviews: [{ rating: 5, author: "Varun S.", comment: "Top-tier EAMCET college with excellent CSE placements." }],
    },
    {
      name: "Vasavi College of Engineering",
      city: "Hyderabad", state: "Telangana", fees: 95000, rating: 4.2,
      type: "Private", examAccepted: ["EAMCET"], cutoffRank: 9000,
      overview: "Vasavi College of Engineering is a well-established autonomous institution known for strong academics and industry tie-ups.",
      placementAvg: 620000, placementHighest: 3000000,
      courses: [{ name: "Information Technology", duration: "4 years", fees: 95000 }],
      reviews: [{ rating: 4, author: "Spandana M.", comment: "Great faculty and consistent placement record." }],
    },
  ];

  for (const c of collegesData) {
    const { courses, reviews, ...collegeFields } = c;
    await prisma.college.create({
      data: {
        ...collegeFields,
        courses: { create: courses },
        reviews: { create: reviews },
      },
    });
  }

  console.log(collegesData.length + " colleges seeded successfully.");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());