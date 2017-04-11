

var BotUtil = {

    findWeatherLocation: function findWeatherLocation(arg) {
        var locName = arg.toLowerCase();

        var wuLocExt;

        if(locName == 'boston' || locName == 'beantown' || locName == 'bos') {
            wuLocExt = '/MA/Boston.json';
        } else if (locName == 'somerville' || locName == 'somer') {
            wuLocExt = '/MA/Somerville.json';
        } else if (locName == 'camrbidge' || locName == 'camberville') {
            wuLocExt = '/MA/Cambridge.json';
        } else if (locName == 'rochester' || locName == 'roc' || locName == 'roch'
            || locName == 'rochacha' || locName == 'rit' || locName == 'roccity') {
            wuLocExt = '/NY/Rochester.json';
        } else if (locName == 'dc' || locName == 'washington' || locName == 'washington dc'
            || locName == 'the district' || locName == 'district of columbia') {
            wuLocExt = '/DC/Washington.json';
        } else if (locName == 'orlando' || locName == 'florida' || locName == 'disney world') {
            wuLocExt = '/FL/Orlando.json';
        } else if (locName == 'richmond') {
            wuLocExt = '/VA/Richmond.json';
        } else {
            wuLocExt = 'ERROR';
        }
        return wuLocExt;
    }


};

module.exports = BotUtil;