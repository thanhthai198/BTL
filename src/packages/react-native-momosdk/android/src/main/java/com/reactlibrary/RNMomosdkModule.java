
package com.reactlibrary;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import vn.momo.momo_partner.AppMoMoLib;
import vn.momo.momo_partner.MoMoParameterNamePayment;

public class RNMomosdkModule extends ReactContextBaseJavaModule {

    private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";
    private Promise mPromise;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            if(mPromise == null || intent == null || (intent != null && intent.getExtras() == null)) return;
            Bundle bundle = intent.getExtras();
            if(bundle != null){
                String appSource = bundle.getString("appSource");
                if(appSource != null && appSource.startsWith("com.mservice")){
                    WritableMap map = Arguments.fromBundle(bundle);
                    mPromise.resolve(map);
                }
            }
        }
    };

    public RNMomosdkModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "RNMomosdk";
    }

    @ReactMethod
    public void requestPayment(ReadableMap readableMap, Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }
        mPromise = promise;
        AppMoMoLib.getInstance().setAction(AppMoMoLib.ACTION.PAYMENT);
        AppMoMoLib.getInstance().setActionType(AppMoMoLib.ACTION_TYPE.GET_TOKEN);
        AppMoMoLib.getInstance().setEnvironment(AppMoMoLib.ENVIRONMENT.PRODUCTION);
        Map<String, Object> eventValue = new HashMap<>();
        // client Required
        if (readableMap != null) {
            ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
            while (iterator.hasNextKey()) {
                String key = iterator.nextKey();
                if (key.equals("isDev") || key.equals("enviroment")) {
                    boolean isDev = false;
                    if(key.equals("enviroment")){
                        if(readableMap.getString(key).equals("0")){
                            isDev = true;
                        }
                    }else if(key.equals("isDev")){
                        isDev = readableMap.getBoolean(key);
                    }
                    if (isDev) {
                        AppMoMoLib.getInstance().setEnvironment(AppMoMoLib.ENVIRONMENT.DEVELOPMENT);
                    }
                } else {
                    switch (readableMap.getType(key)) {
                        case Null:
                            eventValue.put(key, JSONObject.NULL);
                            break;
                        case Boolean:
                            eventValue.put(key, readableMap.getBoolean(key));
                            break;
                        case Number:
                            eventValue.put(key, readableMap.getDouble(key));
                            break;
                        case String:
                            eventValue.put(key, readableMap.getString(key));
                            break;
                    }
                }
            }
        }
        eventValue.put(MoMoParameterNamePayment.REQUEST_TYPE, "payment");
        eventValue.put(MoMoParameterNamePayment.LANGUAGE, "vi");
        eventValue.put(MoMoParameterNamePayment.EXTRA, "");
        AppMoMoLib.getInstance().requestMoMoCallBack(currentActivity, eventValue);
    }
}