const bcrypt = require("bcrypt");
const slugField = require("../helper/slugfield");
const models = require("./models/models");

const dummyData = async () => {
  const { Admin, User, Blog, BlogCategories, Resume, ResumeCategories } = models;
  const admins = await Admin.bulkCreate([
    {
      firstName: "Burak",
      lastName: "Dünal",
      email: "burak@burak.com",
      password: await bcrypt.hash("193745045", 10),
    },
  ]);

  const users = await User.bulkCreate([
    {
      fullname: "Aslı Dünal",
      email: "asli@asli.com",
      password: await bcrypt.hash("193745045", 10),
      img:"images/user/avatar1.jpg",
      title: "Doktora Öğrencisi",
      location: "İzmir - Türkiye",
      about: `Are you ready to embark on an exciting journey into the world of web development? Look no further! We are your trusted partner for mastering 
      the art of web development.Are you ready to embark on an exciting journey into the world of web development? Look no further! We are your trusted partner 
      for mastering the art of web development.Are you ready to embark on an exciting journey into the world of web development? Look no further! We are your 
      trusted partner for mastering the art of web development.`,
      resumeUrl: "docs/my-resume.pdf",
    },
  ]);

  const resume = await Resume.bulkCreate([
    {
      title: "Ege Üniversitesi",
      date: "2023 - Devam Ediyor",
      descr:
        "Doktora (Dr.), İktisat",
    },
    {
      title: "Ege Üniversitesi",
      date: "2018 - 2021",
      descr:`Sosyal Bilimler Enstitüsü İktisat Tezli Yüksek Lisans, 3.83/4.00<br>
      Tez Alanı: Uluslararası İktisat<br>
      Tez Konusu: Türkiye’nin OECD Ülkeleri İle Ticaretinin Analizi: Çekim Modeli Uygulaması`,
    },
    {
      title: "KOSGEB",
      date: "Oca 2018",
      descr:
        "Genç Girişimcilik Sertifikası",
    },
    {
      title: "Polinas",
      date: "Eyl 2017",
      descr:
        "ÜniEndüstri Projesi Katılım Sertifikası",
    },
    {
      title: "Ege Üniversitesi",
      date: "2013 - 2018",
      descr:
        `İktisadi ve İdari Bilimler Fakültesi İngilizce İktisat, 3.80/4.00<br>
        İktisadi ve İdari Bİlimler Fakültesi İngilizce İktisat Bölüm Üçüncüsü<br>
        Üstün Başarı Belgesi 2018`
    },
    {
      title: "Shimano",
      date: "Oca 2023 - Haz 2023",
      descr:
        "Muhasebe Finans Elemanı",
    },
    {
      title: "Etiya Bilgi Teknolojileri",
      date: "Mar 2021 - Ara 2022",
      descr:
        "Çözüm Destek Uzmanı",
    },
  ]);

  const resumeCategories = await ResumeCategories.bulkCreate([
    {
      name: "Education",
      icon: "AcademicCapIcon",
    },
    {
      name: "Experience",
      icon: "BriefcaseIcon",
    },
  ]);

  const blogs = await Blog.bulkCreate([
    {
      title: "Hydrogen-Powered Vehicles",
      img: "/image/blogs/blog-1.png",
      descr: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at ex a ex vulputate accumsan. Sed luctus, arcu et ultricies condimentum, 
      ligula tellus ullamcorper lorem, sit amet scelerisque tortor arcu nec urna. Donec et eleifend mauris. Sed efficitur posuere finibus. Etiam nisl quam, 
      tincidunt volutpat tortor quis, vestibulum elementum urna. Nullam varius euismod augue a blandit. Nunc malesuada id magna id ornare. Suspendisse potenti. 
      Mauris gravida ac nibh faucibus faucibus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Ut ullamcorper pretium accumsan. 
      Vestibulum et magna nec velit interdum tristique vitae at eros. Praesent fringilla ut sem at imperdiet. Suspendisse potenti.Curabitur nec rhoncus turpis. 
      Morbi a urna sed quam euismod pulvinar quis quis diam. Maecenas dapibus neque sed nisi condimentum gravida. Maecenas eget efficitur libero, hendrerit viverra 
      lacus. Donec feugiat blandit nibh nec iaculis. Integer mi nulla, venenatis non sapien ac, volutpat tempus ipsum. Duis convallis massa quis mi cursus eleifend. 
      Donec in tincidunt nunc. Nam fermentum urna et augue fermentum facilisis. In vehicula ligula in turpis luctus luctus. Praesent eu ex iaculis, 
      consectetur lorem non, pulvinar justo. Nullam in egestas eros. Cras in felis et eros efficitur placerat eu sed tortor. Aliquam cursus justo eu ipsum 
      elementum, vitae blandit leo mattis. Fusce nulla lectus, tempus nec interdum vel, bibendum fermentum odio. Etiam molestie in quam sit amet vestibulum.`,
      excerpt: "This article delves into the cutting-edge technology behind hydrogen fuel cells and their environmental benefits.",
      url: slugField("Hydrogen-Powered Vehicles"),
    },
    {
      title: "Mental Health in the Digital Age",
      img: "/image/blogs/blog-2.png",
      descr: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at ex a ex vulputate accumsan. Sed luctus, arcu et ultricies condimentum, 
      ligula tellus ullamcorper lorem, sit amet scelerisque tortor arcu nec urna. Donec et eleifend mauris. Sed efficitur posuere finibus. Etiam nisl quam, 
      tincidunt volutpat tortor quis, vestibulum elementum urna. Nullam varius euismod augue a blandit. Nunc malesuada id magna id ornare. Suspendisse potenti. 
      Mauris gravida ac nibh faucibus faucibus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Ut ullamcorper pretium accumsan. 
      Vestibulum et magna nec velit interdum tristique vitae at eros. Praesent fringilla ut sem at imperdiet. Suspendisse potenti.Curabitur nec rhoncus turpis. 
      Morbi a urna sed quam euismod pulvinar quis quis diam. Maecenas dapibus neque sed nisi condimentum gravida. Maecenas eget efficitur libero, hendrerit viverra 
      lacus. Donec feugiat blandit nibh nec iaculis. Integer mi nulla, venenatis non sapien ac, volutpat tempus ipsum. Duis convallis massa quis mi cursus eleifend. 
      Donec in tincidunt nunc. Nam fermentum urna et augue fermentum facilisis. In vehicula ligula in turpis luctus luctus. Praesent eu ex iaculis, 
      consectetur lorem non, pulvinar justo. Nullam in egestas eros. Cras in felis et eros efficitur placerat eu sed tortor. Aliquam cursus justo eu ipsum 
      elementum, vitae blandit leo mattis. Fusce nulla lectus, tempus nec interdum vel, bibendum fermentum odio. Etiam molestie in quam sit amet vestibulum.`,
      excerpt: "This article explores the intricate relationship between social media usage and mental health.",
      url: slugField("Mental Health in the Digital Age"),
    },
    {
      title: "Mars Colonization and Beyond",
      img: "/image/blogs/blog-1.png",
      descr: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at ex a ex vulputate accumsan. Sed luctus, arcu et ultricies condimentum, 
      ligula tellus ullamcorper lorem, sit amet scelerisque tortor arcu nec urna. Donec et eleifend mauris. Sed efficitur posuere finibus. Etiam nisl quam, 
      tincidunt volutpat tortor quis, vestibulum elementum urna. Nullam varius euismod augue a blandit. Nunc malesuada id magna id ornare. Suspendisse potenti. 
      Mauris gravida ac nibh faucibus faucibus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Ut ullamcorper pretium accumsan. 
      Vestibulum et magna nec velit interdum tristique vitae at eros. Praesent fringilla ut sem at imperdiet. Suspendisse potenti.Curabitur nec rhoncus turpis. 
      Morbi a urna sed quam euismod pulvinar quis quis diam. Maecenas dapibus neque sed nisi condimentum gravida. Maecenas eget efficitur libero, hendrerit viverra 
      lacus. Donec feugiat blandit nibh nec iaculis. Integer mi nulla, venenatis non sapien ac, volutpat tempus ipsum. Duis convallis massa quis mi cursus eleifend. 
      Donec in tincidunt nunc. Nam fermentum urna et augue fermentum facilisis. In vehicula ligula in turpis luctus luctus. Praesent eu ex iaculis, 
      consectetur lorem non, pulvinar justo. Nullam in egestas eros. Cras in felis et eros efficitur placerat eu sed tortor. Aliquam cursus justo eu ipsum 
      elementum, vitae blandit leo mattis. Fusce nulla lectus, tempus nec interdum vel, bibendum fermentum odio. Etiam molestie in quam sit amet vestibulum.`,
      excerpt: "This article takes readers on a journey through the latest developments in space exploration.",
      url: slugField("Mars Colonization and Beyond"),
    },
  ]);

  const blogCategories = await BlogCategories.bulkCreate([
    {
      name: "Financial",
    },
    {
      name: "Technology",
    },
  ]);

  await resumeCategories[0].addResume(resume[0]);
  await resumeCategories[0].addResume(resume[1]);
  await resumeCategories[0].addResume(resume[2]);
  await resumeCategories[0].addResume(resume[3]);
  await resumeCategories[0].addResume(resume[4]);
  await resumeCategories[1].addResume(resume[5]);
  await resumeCategories[1].addResume(resume[6]);

  await blogCategories[0].addBlog(blogs[0]);
  await blogCategories[0].addBlog(blogs[1]);
  await blogCategories[1].addBlog(blogs[2]);
};

module.exports = dummyData;
