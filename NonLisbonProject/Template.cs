using System.Collections.Generic;

namespace NonLisbonProject
{
    public class Template
    {
        public string MessageTopClothes { get; private set; }
        public string Outerwear { get; private set; }
        public string MessageBottonClothes { get; private set; }
        public string Underwear { get; private set; }
        public string AdditionalMessage { get; private set; }
        public Template(string messageTopClothes, string messageBottonClothes, string additionalMessage = null)
        {
            MessageTopClothes = messageTopClothes;
            Outerwear = "";
            MessageBottonClothes = messageBottonClothes;
            Underwear = "";
            AdditionalMessage = additionalMessage ?? "";
        }
        public Template(string messageTopClothes, string outerwear, string messageBottonClothes, string underwear,string additionalMessage = null)
        {
            MessageTopClothes = messageTopClothes;
            Outerwear = outerwear;
            MessageBottonClothes = messageBottonClothes;
            Underwear = underwear;
            AdditionalMessage = additionalMessage ?? "";
        }
        public void AddOuterwearUnderwear(string outerwear, string underwear)
        {
            Outerwear = outerwear;
            Underwear = underwear;
        }
        public void ReplaceAdditionalMessage(string additionalMessage)
        {
            AdditionalMessage = additionalMessage;
        }

        public override string ToString()
        {
            return string.Join("", MessageTopClothes, Outerwear, MessageBottonClothes, Underwear, AdditionalMessage);
        }
    }
    public static class CreateMock
    {
        public static IEnumerable<Template> GetMockDataTemplates()
        {
            Template templateOne = new Template("Мы проанализировали погоду в выбранном вами городе и можем предложить некоторый набор вещей.Так, например, в качестве верхней одежды команда нашего сайта рекомендует вам следующие предметы гардероба: ",". Чтобы вашим ногам было комфортно можем предложить следующие вещи: ",".");
            Template templateTwo = new Template("Чтобы вам было сегодня комфортно в городе, мы рекомендуем вам надеть один из следующих элементов верхней одежды: ",". А для максимального комфорта всего тела рекомендуем рассмотреть один из следующих предметов одежды на ноги: ", ".");
            Template templateThree = new Template("Вы спросили? Мы ответили! Чтобы вас ничего не отвлекало от прогулок по городу и наслаждениями его видами наша команда рекомендует вам в качестве предмета одежды ниже пояса рассмотреть один из следующих вариантов: ",".  А для обеспечения максимального удобства и комфорта рекомендуем вам выбрать в качестве верхней одежды что-то из этого списка: ", ".");
            Template templateFour = new Template("Для приятного отдыха в эту погоду в выбранном вами городе на основе полученных данных из фотографий и погоды мы предлагаем вам на выбор верхнюю одежду: ",". Также рекомендуем надеть следующие вещи на ноги: ", ".");
            Template templateFive = new Template("На основе собранных данных система рекомендует в данном городе следующие типы одежды: ",". На ноги же предлагается на выбор следующее: ", ".");
            List<Template> templates = new List<Template>();
            templates.Add(templateOne); 
            templates.Add(templateTwo); 
            templates.Add(templateThree);
            templates.Add(templateFour);
            templates.Add(templateFive);
            return templates;
        }
    }

}
