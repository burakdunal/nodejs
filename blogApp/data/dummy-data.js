const slugField = require("../helper/slugfield");
const Blog = require("../models/blog");
const Category = require("../models/category");
const Role = require("../models/role");
const User = require("../models/user");
const AppLogs = require("../models/app-logs");
const bcrypt = require("bcrypt");

const dummyData = async() => {
    const count = await Category.count();
    //const count = await Blog.count();

    if(count == 0){
        const users = await User.bulkCreate([
            {fullname: "Burak Admin", email: "burak@burak.com", password: await bcrypt.hash("193745045", 10)},
            {fullname: "Burak Moderator 1", email: "burak2@burak.com", password: await bcrypt.hash("193745045", 10)},
            {fullname: "Burak Moderator 2", email: "burak3@burak.com", password: await bcrypt.hash("193745045", 10)},
            {fullname: "Burak Guest 1", email: "burak4@burak.com", password: await bcrypt.hash("193745045", 10)},
            {fullname: "Burak Guest 2", email: "burak5@burak.com", password: await bcrypt.hash("193745045", 10)}
        ]);

        const roles = await Role.bulkCreate([
            {rolename: "admin"},
            {rolename: "moderator"},
            {rolename: "guest"}
        ]);

        await users[0].addRole(roles[0]);
        await users[1].addRole(roles[1]);
        await users[2].addRole(roles[1]);
        await users[3].addRole(roles[2]);
        await users[4].addRole(roles[2]);

        const categories = await Category.bulkCreate([
            { name: "Web Geliştirme", url: slugField("Web Geliştirme") },
            { name: "Mobil Geliştirme", url: slugField("Mobil Geliştirme") },
            { name: "Programlama", url: slugField("Programlama") },
            { name: "Veri Analizi", url: slugField("Veri Analizi") },
            { name: "Ofis Uygulamaları", url: slugField("Ofis Uygulamaları") }
        ]);

        const blogs = await Blog.bulkCreate([
            {
                baslik: "Node.js ile Sıfırdan İleri Seviye Web Geliştirme",
                url: slugField("Node.js ile Sıfırdan İleri Seviye Web Geliştirme"),
                altbaslik: "Node.js ile sıfırdan ileri seviye dinamik web uygulaması geliştirmeyi öğren.",
                aciklama: "Node.js kursumuza katılmak için temel düzeyde Javascript programlama bilgisi ve temel düzelde HTML/CSS bilgisine sahip olmanız yeterlidir. Kursumuz sıfırdan ileri seviyeye tüm Node.js konularını içeriyor ve her konu en temelden detaylı bir şekilde anlatılıyor. Ayrıca her bölümde öğrendiklerimizi uygulayabileceğimiz gerçek bir projeyi sıfırdan ileri seviyeye adım adım geliştiriyoruz.",
                resim: "1-1694094046599.png",
                anasayfa: true,
                onay: true,
                userId: 2
            },
            {
                baslik: "Python İle Sıfırdan İleri Seviye Programlama",
                url: slugField("Python İle Sıfırdan İleri Seviye Programlama"),
                altbaslik: "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
                aciklama: "Python programlamanın popülerliğinden dolayı bir çok yazılımcı ve firma python için kütüphaneler oluşturup python kütüphane havuzunda paylaşmaktadır. Dolayısıyla python dünyasına giriş yaptığımızda işlerimizi kolaylaştıracak bazı imkanlara sahip oluyoruz.",
                resim: "2-1694093607906.jpg",
                anasayfa: true,
                onay: true,
                userId: 2
            },
            {
                baslik: "Python İle Sıfırdan İleri Seviye Programlama 3",
                url: slugField("Python İle Sıfırdan İleri Seviye Programlama 3"),
                altbaslik: "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
                aciklama: "Python programlamanın popülerliğinden dolayı bir çok yazılımcı ve firma python için kütüphaneler oluşturup python kütüphane havuzunda paylaşmaktadır. Dolayısıyla python dünyasına giriş yaptığımızda işlerimizi kolaylaştıracak bazı imkanlara sahip oluyoruz.",
                resim: "2-1694093607906.jpg",
                anasayfa: true,
                onay: true,
                userId: 2
            },
            {
                baslik: "Python İle Sıfırdan İleri Seviye Programlama 4",
                url: slugField("Python İle Sıfırdan İleri Seviye Programlama 4"),
                altbaslik: "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
                aciklama: "Python programlamanın popülerliğinden dolayı bir çok yazılımcı ve firma python için kütüphaneler oluşturup python kütüphane havuzunda paylaşmaktadır. Dolayısıyla python dünyasına giriş yaptığımızda işlerimizi kolaylaştıracak bazı imkanlara sahip oluyoruz.",
                resim: "2-1694093607906.jpg",
                anasayfa: true,
                onay: true,
                userId: 3
            },
            {
                baslik: "Python İle Sıfırdan İleri Seviye Programlama 5",
                url: slugField("Python İle Sıfırdan İleri Seviye Programlama 5"),
                altbaslik: "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
                aciklama: "Python programlamanın popülerliğinden dolayı bir çok yazılımcı ve firma python için kütüphaneler oluşturup python kütüphane havuzunda paylaşmaktadır. Dolayısıyla python dünyasına giriş yaptığımızda işlerimizi kolaylaştıracak bazı imkanlara sahip oluyoruz.",
                resim: "2-1694093607906.jpg",
                anasayfa: true,
                onay: true,
                userId: 3
            },
            {
                baslik: "Python İle Sıfırdan İleri Seviye Programlama 6",
                url: slugField("Python İle Sıfırdan İleri Seviye Programlama 6"),
                altbaslik: "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
                aciklama: "Python programlamanın popülerliğinden dolayı bir çok yazılımcı ve firma python için kütüphaneler oluşturup python kütüphane havuzunda paylaşmaktadır. Dolayısıyla python dünyasına giriş yaptığımızda işlerimizi kolaylaştıracak bazı imkanlara sahip oluyoruz.",
                resim: "2-1694093607906.jpg",
                anasayfa: true,
                onay: true,
                userId: 3
            },
            {
                baslik: "Python İle Sıfırdan İleri Seviye Programlama 7",
                url: slugField("Python İle Sıfırdan İleri Seviye Programlama 7"),
                altbaslik: "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
                aciklama: "Python programlamanın popülerliğinden dolayı bir çok yazılımcı ve firma python için kütüphaneler oluşturup python kütüphane havuzunda paylaşmaktadır. Dolayısıyla python dünyasına giriş yaptığımızda işlerimizi kolaylaştıracak bazı imkanlara sahip oluyoruz.",
                resim: "2-1694093607906.jpg",
                anasayfa: true,
                onay: true,
                userId: 3
            },
            {
                baslik: "Python İle Sıfırdan İleri Seviye Programlama 8",
                url: slugField("Python İle Sıfırdan İleri Seviye Programlama 8"),
                altbaslik: "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
                aciklama: "Python programlamanın popülerliğinden dolayı bir çok yazılımcı ve firma python için kütüphaneler oluşturup python kütüphane havuzunda paylaşmaktadır. Dolayısıyla python dünyasına giriş yaptığımızda işlerimizi kolaylaştıracak bazı imkanlara sahip oluyoruz.",
                resim: "2-1694093607906.jpg",
                anasayfa: true,
                onay: true,
                userId: 3
            },
            {
                baslik: "Python İle Sıfırdan İleri Seviye Programlama 9",
                url: slugField("Python İle Sıfırdan İleri Seviye Programlama 9"),
                altbaslik: "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
                aciklama: "Python programlamanın popülerliğinden dolayı bir çok yazılımcı ve firma python için kütüphaneler oluşturup python kütüphane havuzunda paylaşmaktadır. Dolayısıyla python dünyasına giriş yaptığımızda işlerimizi kolaylaştıracak bazı imkanlara sahip oluyoruz.",
                resim: "2-1694093607906.jpg",
                anasayfa: true,
                onay: true,
                userId: 3
            }
        ]);

        await categories[0].addBlog(blogs[0]);
        await categories[0].addBlog(blogs[1]);
        await categories[0].addBlog(blogs[2]);
        await categories[0].addBlog(blogs[3]);
        await categories[0].addBlog(blogs[4]);
        await categories[0].addBlog(blogs[5]);
        await categories[0].addBlog(blogs[6]);
        await categories[1].addBlog(blogs[7]);
        await categories[1].addBlog(blogs[8]);

        await categories[1].addBlog(blogs[2]);
        await categories[1].addBlog(blogs[3]);
        await categories[2].addBlog(blogs[2]);
        await categories[2].addBlog(blogs[3]);

        await blogs[0].addCategory(categories[1]);

        // await categories[0].createBlog({
        //     baslik: "Yeni Blog",
        //     altbaslik: "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
        //     aciklama: "Python programlamanın popülerliğinden dolayı bir çok yazılımcı ve firma python için kütüphaneler oluşturup python kütüphane havuzunda paylaşmaktadır. Dolayısıyla python dünyasına giriş yaptığımızda işlerimizi kolaylaştıracak bazı imkanlara sahip oluyoruz.",
        //     resim: "2-1694093607906.jpg",
        //     anasayfa: true,
        //     onay: true
        // });

        await AppLogs.sync();
        console.log("Kategoriler ve bloglar eklendi.");
    }
}

module.exports = dummyData;