using System;
using System.Collections.Generic;
using System.Text;

namespace NonLisbonProject.Services
{
    public static class ClothesService
    {
        static readonly HashSet<string> DownClothesCitys = new HashSet<string>(new string[] { "джинсы", "спортивные штаны", "брюки", "колготки", "юбка", "шорты" });
        static readonly HashSet<string> UpClothesMoscow = new HashSet<string>(new string[] { "футболка", "майка", "жилетка", "куртка", "пальто", "кофта", "свитер", "ветровка", "худи", "водоласка", "платье", "топик", "рубашка", "блузка" });
        static readonly HashSet<string> UpClothesDeliSidney = new HashSet<string>(new string[] { "футболка", "майка", "жилетка", "кофта", "ветровка", "худи", "водоласка", "платье", "топик", "рубашка", "блузка" });
        static readonly HashSet<string> UpClothesNewYork = new HashSet<string>(new string[] { "футболка", "майка", "жилетка", "пальто", "кофта", "свитер", "ветровка", "худи", "водоласка", "платье", "куртка", "топик", "рубашка", "блузка" });
        static readonly HashSet<string> UpClothesLondonParis = new HashSet<string>(new string[] { "футболка", "майка", "жилетка", "пальто", "кофта", "куртка", "свитер", "ветровка", "худи", "водоласка", "платье", "топик", "топик", "рубашка", "блузка" });
        static readonly HashSet<string> UpClothesTokioMadridRome = new HashSet<string>(new string[] { "футболка", "майка", "жилетка", "пальто", "кофта", "свитер", "ветровка", "худи", "водоласка", "платье", "топик", "рубашка", "блузка" });

        static readonly HashSet<string> UpWeatherSkyClear = new HashSet<string>(new string[] { "майка","футболка", "жилетка", "куртка", "пальто", "кофта", "свитер", "ветровка", "худи", "водоласка", "платье", "рубашка", "блузка" });
        static readonly HashSet<string> DownWeatherSkyClear = new HashSet<string>(new string[] { "джинсы", "спортивные штаны", "брюки", "колготки", "юбка", "шорты" });
        static readonly HashSet<string> UpWeatherRain = new HashSet<string>(new string[] { "майка", "футболка", "жилетка", "пальто", "кофта", "свитер", "ветровка", "худи", "водоласка", "платье", "рубашка", "блузка" });
        static readonly HashSet<string> DownWeatherRain = new HashSet<string>(new string[] { "джинсы", "спортивные штаны", "брюки", "колготки", "колготки", "юбка", "шорты" });
        static readonly HashSet<string> UpWeatherSnow = new HashSet<string>(new string[] { "куртка", "пальто", "кофта", "свитер" });
        static readonly HashSet<string> DownWeatherSnow = new HashSet<string>(new string[] { "джинсы", "спортивные штаны", "брюки" });

        //OnePart - температура меньше -5
        //TwoPart - температура от -5 до 7
        //ThreePart - температура от 7 до 20
        //FourPart - температура больше 20
        static readonly HashSet<string> UpTempOnePart = new HashSet<string>(new string[] { "куртка", "пальто", "кофта" });
        static readonly HashSet<string> DownTempOnePart = new HashSet<string>(new string[] { "джинсы", "спортивные штаны", "брюки" });
        static readonly HashSet<string> UpTempTwoPart = new HashSet<string>(new string[] { "куртка", "пальто", "кофта", "свитер", "ветровка", "худи", "водоласка" });
        static readonly HashSet<string> DownTempTwoPart = new HashSet<string>(new string[] { "джинсы", "спортивные штаны", "брюки" });
        static readonly HashSet<string> UpTempThreePart = new HashSet<string>(new string[] { "футболка", "майка", "жилетка", "кофта", "ветровка", "худи", "водоласка", "платье", "рубашка", "блузка" });
        static readonly HashSet<string> DownTempThreePart = new HashSet<string>(new string[] { "джинсы", "спортивные штаны", "брюки", "колготки" });
        static readonly HashSet<string> UpTempFourPart = new HashSet<string>(new string[] { "футболка", "майка", "платье", "топик", "рубашка", "блузка" });
        static readonly HashSet<string> DownTempFourPart = new HashSet<string>(new string[] { "брюки", "колготки", "юбка", "шорты" });

        static readonly List<Template> templates = new List<Template>(CreateMock.GetMockDataTemplates());

        public static string GetPrediction(string city,int weatherId,double temperature)
        {
            HashSet<string> DownClothes = new HashSet<string>(DownClothesCitys);

            // верхняя одежда города
            HashSet<string> UpClothes = null;
            if (city == "Deli" || city == "Sidney")
                UpClothes = new HashSet<string>(UpClothesDeliSidney);
            if (city == "NewYork")
                UpClothes = new HashSet<string>(UpClothesNewYork);
            if (city == "London" || city == "Paris")
                UpClothes = new HashSet<string>(UpClothesLondonParis);
            if (city == "Rome" || city == "Tokio" || city == "Madrid")
                UpClothes = new HashSet<string>(UpClothesTokioMadridRome);
            if (city == "Moscow" || UpClothes == null)
                UpClothes = new HashSet<string>(UpClothesMoscow);

            // нижняя и верхняя одежда с учетом температуры
            if (temperature < -5)
            {
                DownClothes.IntersectWith(DownTempOnePart);
                UpClothes.IntersectWith(UpTempOnePart);
            }
            if (temperature >= -5 && temperature < 7)
            {
                DownClothes.IntersectWith(DownTempTwoPart);
                UpClothes.IntersectWith(UpTempTwoPart);
            }
            if (temperature >= 7 && temperature < 20)
            {
                DownClothes.IntersectWith(DownTempThreePart);
                UpClothes.IntersectWith(UpTempThreePart);

            }
            if (temperature >= 20)
            {
                DownClothes.IntersectWith(DownTempFourPart);
                UpClothes.IntersectWith(UpTempFourPart);
            }

            Random random = new Random();
            Template prediction = templates[random.Next(5)];

            // нижняя и верхняя одежда с учетом id погоды
            weatherId /= 100;
            if (weatherId == 7 || weatherId == 8)
            {
                DownClothes.IntersectWith(DownWeatherSkyClear);
                UpClothes.IntersectWith(UpWeatherSkyClear);
            }
            if (weatherId == 6)
            {
                DownClothes.IntersectWith(DownWeatherSnow);
                UpClothes.IntersectWith(UpWeatherSnow);
            }
            if (weatherId == 2 || weatherId == 3 || weatherId == 5)
            {
                DownClothes.IntersectWith(DownWeatherRain);
                UpClothes.IntersectWith(UpWeatherRain);
                prediction.ReplaceAdditionalMessage(". Обязательно, чтобы не промокнуть возьмите зонтик!");
            }
            prediction.AddOuterwearUnderwear(string.Join(", ", UpClothes), string.Join(", ", DownClothes));
            return prediction.ToString();
            
        }
    }
}
