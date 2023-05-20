// Semester: 2023A
// Assessment: Assignment 2
// Author: 
//     To Bao Minh Hoang: s3978554
//     Le Viet Bao: s3979654
//     Pho An Ninh: s3978162
// Acknowledgement: https://youtube.com/watch?v=991fdnSllcw&feature=share - live search bar, chatgpt, Mr Tom Huynh's RMIT Store 

const products = [
    {
        category: "dog page",
        image: "product-1.jpg",
        name: "Bully Max Puppy Bundle Pack, High Protein & Growth Puppy Food, Immunity Soft Chews for Growth, Dog Supplements Plus Food",
        price: 64.95,
        description: "PUPPY FOOD FOR GROWTH: This Bully Max Dog Food variant features 24/14 High Protein & Growth formula that provcategoryes puppies with 419 calories per cup for the energy needed by the growing young canines to reach their full potential. It is also packed with vitamins A, B12, C, D, E, and K and fortified with a postbiotic ingredient for the dog’s gut health and immune function."
    },
    {
        category: "cat page",
        image: "product-2.jpg",
        name: "Basics Tall Cat Scratching Post",
        price: 59.95,
        description: "Scratching post provcategoryes a place for cats to sharpen their claws and keep nails healthy. Includes a single pillar scratching post in neutral colors with a replaceable dangle toy. Natural jute fiber provcategoryes an optimal scratching surface. Sturdy wood base helps prevent the post from tipping. categoryeal for redirecting cats away from scratching household carpet or furniture. Product dimensions: 16 x 16 x 35 inches (LxWxH)"
    },
    {
        category: "cat page",
        image: "product-3.jpg",
        name: "Purina ONE Natural Dry Cat Food, Tender Selects Blend With Real Salmon - 7 lb. Bag",
        price: 69.95,
        description: "Feed your cat the crunchy bites and meaty morsels she adores with Purina ONE Tender Selects Blend With Real Salmon adult dry cat food. What are the ingredients in Purina ONE? Purina Tender Selects salmon cat food uses a SmartBlend of real ingredients, including accents of carrots and peas. This adult, natural cat food has added vitamins, minerals and nutrients for balanced nutrition. Real salmon is the first ingredient, helping provcategorye the protein your cat needs to support strong muscles. Plus, the digestive care cat food has natural prebiotic fiber for gut health and immune support. With added calcium, the crunchy cat food kibble helps maintain her strong teeth, too. All Purina ONE cat food ingredients serve a purpose, creating digestive health cat food with 0 percent fillers. Check the bag for the calories per serving, feeding chart and instructions on changing cat food, and take our 28 Day Challenge to see the difference Purina ONE Tender Selects salmon cat food can make. "
    },
    {
        category: "dog page",
        image: "product-4.jpg",
        name: "CESAR Small Breed Dry Dog Food Filet Mignon Flavor with Spring Vegetables Garnish Dog Kibble, 5 lb. Bag",
        price: 34.95,
        description: "Give your dog a seat at the dinner table with CESAR Filet Mignon Flavor and Spring Vegetables Garnish Dry Dog Food. Made with real beef as the first ingredient, this gourmet dog food features tender pieces that will make your dog dance around their bowl come dinnertime. CESAR Food for Dogs is also deliciously crafted with 26 nutrients small dogs need to stay healthy. Serve your little furry companion a savory and nutritious meal with CESAR Dog Food.        "
    },
    {
        category: "dog page",
        image: "product-5.jpg",
        name: "Best Pet Supplies Crinkle Dog Toy",
        price: 21.95,
        description: "Give Your Dog an Active Play Outlet with a Soft Crinkle Paper Dog Toy from Best Pet Supplies We all want to give our dogs a healthy way to play, have fun, and enjoy staying active; especially when it comes to giving them toys that are less messy and stand up to all the biting, chewing, and tugging. That’s why we created these super cute, high-quality Best Pet Supplies Duck-Shaped Dog Toys with built-in squeaker and crinkle paper. These versatile toys for dogs give them multiple ways to play and stay engaged while satisfying their natural behavioral needs. And because there’s no stuffing you don’t have to worry about cleaning up a big mess the moment your dog rips into them. Product Details: Soft Duck Dog Toy Built-In Squeezable Squeaker Crinkle Paper Interior No Stuffing or Fluff Available in 6 Fun Colors Overall Length: 15”        "
    },
    {
        category: "dog page",
        image: "product-6.jpg",
        name: "IAMS Adult High Protein Large Breed Dry Dog Food with Real Chicken, 30 lb. Bag",
        price: 56,
        description: "Your active big dog is one-of-a-kind… that’s why IAMS makes a dry dog food that’s just as unique as they are. IAMS Adult Large Breed Dry Dog Food with Real Chicken is formulated to support large breed active dogs by maintaining bone and joint health. With real, farm-raised chicken as the first ingredient, this dry dog food helps provcategorye joint support, while a tailored blend of wholesome fibers and prebiotics promotes healthy digestion and immunity. Plus, the tasty dog kibble helps maintain strong muscles. When you feed your large dog IAMS dry food, you can feel good knowing they’re getting the nutrition they need to bring out their unique best.        "
    },
    {
        category: "dog page",
        image: "product-7.jpg",
        name: "PEDIGREE PUPPY Soft Wet Dog Food 8-Count Variety Pack, 3.5 oz Pouches",
        price: 49,
        description: "Formulated to help promote strong, healthy teeth and bones, PEDIGREE Puppy Morsels in Sauce With Chicken and Morsels in Sauce With Beef is the wet dog food specially designed to support growing puppies. Made with real ingredients including chicken or beef, your puppy will love this soft food as a treat, topper, as a mixer with dry puppy food, or a complete meal! Feed your puppy with confcategoryence knowing that PEDIGREE dog food is made with DHA to help support brain development, and the necessary vitamins and minerals for a complete and balanced meal. With so many delicious flavors to choose from, PEDIGREE Puppy formulas are the great tasting way to give your precious new pup the nutrition they deserve."
    },
    {
        category: "cat page",
        image: "product-8.jpg",
        name: "Purina Friskies Gravy Wet Cat Food Variety Pack, Tasty Treasures Prime Filets - (24) 5.5 oz. Cans",
        price: 50.98,
        description: "Keep your curious feline interested in mealtime by rotating the scrumptious recipes this Purina Friskies Tasty Treasures wet cat food variety pack. With three different recipes in each package that give her the classic poultry and delicious seafood flavors she loves, it's easy to turn everyday meals into extraordinary taste adventures. The tender, shredded bites offer a palate-pleasing texture, and each entree is covered in a savory gravy or sauce that's sure to have your content cat licking her dish clean. Because each recipe is formulated to deliver 100 percent complete and balanced nutrition for adult cats, this wet cat food helps support her overall wellness while provcategorying the tastes she loves. Fill her dish with a different variety of this yummy and nutritious Friskies canned cat food created by Purina at each feeding, and watch as she delights in every delicious bite.     "
    },
];


module.exports = products;